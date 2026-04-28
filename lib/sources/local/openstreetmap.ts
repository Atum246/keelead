// OpenStreetMap — Free Local Business Data via Overpass API + Nominatim
// Completely free, no API key required, worldwide coverage
import { BaseSource } from "../base"
import type { Lead, SearchOptions, CompanyData, ContactData } from "../types"

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
const OVERPASS_URL = "https://overpass-api.de/api/interpreter"
const USER_AGENT = "KeeLead/1.0 (lead-generation-tool)"

// Common business type mappings for smart query parsing
const BUSINESS_TYPE_MAP: Record<string, { tag: string; value: string }> = {
  // Food & Drink
  restaurant: { tag: "amenity", value: "restaurant" },
  restaurants: { tag: "amenity", value: "restaurant" },
  cafe: { tag: "amenity", value: "cafe" },
  cafes: { tag: "amenity", value: "cafe" },
  "coffee shop": { tag: "amenity", value: "cafe" },
  "coffee shops": { tag: "amenity", value: "cafe" },
  bar: { tag: "amenity", value: "bar" },
  bars: { tag: "amenity", value: "bar" },
  pub: { tag: "amenity", value: "pub" },
  pubs: { tag: "amenity", value: "pub" },
  bakery: { tag: "shop", value: "bakery" },
  bakeries: { tag: "shop", value: "bakery" },
  pizza: { tag: "amenity", value: "restaurant" },
  sushi: { tag: "amenity", value: "restaurant" },
  // Services
  plumber: { tag: "office", value: "plumber" },
  plumbers: { tag: "office", value: "plumber" },
  dentist: { tag: "amenity", value: "dentist" },
  dentists: { tag: "amenity", value: "dentist" },
  doctor: { tag: "amenity", value: "doctors" },
  doctors: { tag: "amenity", value: "doctors" },
  pharmacy: { tag: "amenity", value: "pharmacy" },
  pharmacies: { tag: "amenity", value: "pharmacy" },
  hospital: { tag: "amenity", value: "hospital" },
  hospitals: { tag: "amenity", value: "hospital" },
  bank: { tag: "amenity", value: "bank" },
  banks: { tag: "amenity", value: "bank" },
  hotel: { tag: "tourism", value: "hotel" },
  hotels: { tag: "tourism", value: "hotel" },
  gym: { tag: "leisure", value: "fitness_centre" },
  gyms: { tag: "leisure", value: "fitness_centre" },
  salon: { tag: "shop", value: "hairdresser" },
  salons: { tag: "shop", value: "hairdresser" },
  "hair salon": { tag: "shop", value: "hairdresser" },
  // Retail
  supermarket: { tag: "shop", value: "supermarket" },
  supermarkets: { tag: "shop", value: "supermarket" },
  grocery: { tag: "shop", value: "supermarket" },
  groceries: { tag: "shop", value: "supermarket" },
  bookstore: { tag: "shop", value: "books" },
  bookstores: { tag: "shop", value: "books" },
  bookshop: { tag: "shop", value: "books" },
  clothing: { tag: "shop", value: "clothes" },
  electronics: { tag: "shop", value: "electronics" },
  furniture: { tag: "shop", value: "furniture" },
  // Professional
  lawyer: { tag: "office", value: "lawyer" },
  lawyers: { tag: "office", value: "lawyer" },
  attorney: { tag: "office", value: "lawyer" },
  "real estate": { tag: "office", value: "estate_agent" },
  "real estate agent": { tag: "office", value: "estate_agent" },
  architect: { tag: "office", value: "architect" },
  architects: { tag: "office", value: "architect" },
  accountant: { tag: "office", value: "accountant" },
  accountants: { tag: "office", value: "accountant" },
  // Education
  school: { tag: "amenity", value: "school" },
  schools: { tag: "amenity", value: "school" },
  university: { tag: "amenity", value: "university" },
  universities: { tag: "amenity", value: "university" },
  // Automotive
  car: { tag: "shop", value: "car" },
  "car repair": { tag: "shop", value: "car_repair" },
  "car dealer": { tag: "shop", value: "car" },
  mechanic: { tag: "shop", value: "car_repair" },
  mechanics: { tag: "shop", value: "car_repair" },
}

interface NominatimResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: [string, string, string, string] // south, north, west, east
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon?: string
}

interface OverpassElement {
  type: "node" | "way" | "relation"
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

interface OverpassResponse {
  version: number
  generator: string
  elements: OverpassElement[]
}

interface ParsedQuery {
  searchTerm: string | null // null means "all businesses"
  location: string
  businessType: { tag: string; value: string } | null
}

export class OpenStreetMapSource extends BaseSource {
  name = "OpenStreetMap"
  id = "openstreetmap"
  category = "local"
  requiresApiKey = false
  rateLimit = 10

  /**
   * Parse user query into search term + location
   * Examples:
   *   "restaurants in London" → { searchTerm: null, location: "London", businessType: {amenity: restaurant} }
   *   "coffee shops in Tokyo" → { searchTerm: null, location: "Tokyo", businessType: {amenity: cafe} }
   *   "plumbers near Berlin" → { searchTerm: null, location: "Berlin", businessType: {office: plumber} }
   *   "pizza in New York" → { searchTerm: "pizza", location: "New York", businessType: {amenity: restaurant} }
   *   "dentists in Paris" → { searchTerm: null, location: "Paris", businessType: {amenity: dentist} }
   *   "tech companies in San Francisco" → { searchTerm: "tech", location: "San Francisco", businessType: null }
   *   "New York" → { searchTerm: null, location: "New York", businessType: null }
   */
  private parseQuery(query: string): ParsedQuery {
    const q = query.trim()

    // Try to match "{type} in/near {location}" pattern
    const locationPatterns = [
      /^(.+?)\s+in\s+(.+)$/i,
      /^(.+?)\s+near\s+(.+)$/i,
      /^(.+?)\s+around\s+(.+)$/i,
      /^(.+?)\s+close\s+to\s+(.+)$/i,
      /^(.+?)\s+nearby\s+(.+)$/i,
    ]

    for (const pattern of locationPatterns) {
      const match = q.match(pattern)
      if (match) {
        const rawType = match[1].trim().toLowerCase()
        const location = match[2].trim()

        // Check if the type matches a known business category
        const businessType = this.lookupBusinessType(rawType)

        if (businessType) {
          return { searchTerm: null, location, businessType }
        }

        // Unknown type — use as name search
        return { searchTerm: rawType, location, businessType: null }
      }
    }

    // No "in/near" pattern — check if the whole query is a known business type
    const businessType = this.lookupBusinessType(q.toLowerCase())
    if (businessType) {
      return { searchTerm: null, location: q, businessType }
    }

    // Treat whole query as a location search for all businesses
    return { searchTerm: null, location: q, businessType: null }
  }

  private lookupBusinessType(term: string): { tag: string; value: string } | null {
    // Direct match
    if (BUSINESS_TYPE_MAP[term]) return BUSINESS_TYPE_MAP[term]

    // Try removing trailing 's' for plurals
    const singular = term.replace(/s$/, "")
    if (BUSINESS_TYPE_MAP[singular]) return BUSINESS_TYPE_MAP[singular]

    // Partial match — check if any key is contained in the term
    for (const [key, val] of Object.entries(BUSINESS_TYPE_MAP)) {
      if (term.includes(key) || key.includes(term)) return val
    }

    return null
  }

  /**
   * Geocode a location string using Nominatim
   */
  private async geocode(location: string): Promise<NominatimResult | null> {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(location)}&format=json&limit=1`
    const results = await this.fetchJson<NominatimResult[]>(url, {
      "User-Agent": USER_AGENT,
    })
    if (!results || results.length === 0) return null
    return results[0]
  }

  /**
   * Build Overpass QL query based on parsed query
   */
  private buildOverpassQuery(parsed: ParsedQuery, bbox: string): string {
    // bbox format: "south,west,north,east"

    if (parsed.businessType) {
      // Search by business type
      const { tag, value } = parsed.businessType
      const nameFilter = parsed.searchTerm
        ? `["name"~"${parsed.searchTerm}",i]`
        : ""

      return `[out:json][timeout:15];
(
  node["${tag}"="${value}"]${nameFilter}(${bbox});
  way["${tag}"="${value}"]${nameFilter}(${bbox});
);
out center body;`
    }

    if (parsed.searchTerm) {
      // Search by name across all business categories
      const term = parsed.searchTerm
      return `[out:json][timeout:15];
(
  node["name"~"${term}",i]["amenity"](${bbox});
  node["name"~"${term}",i]["shop"](${bbox});
  node["name"~"${term}",i]["office"](${bbox});
  node["name"~"${term}",i]["tourism"](${bbox});
  node["name"~"${term}",i]["leisure"](${bbox});
  way["name"~"${term}",i]["amenity"](${bbox});
  way["name"~"${term}",i]["shop"](${bbox});
  way["name"~"${term}",i]["office"](${bbox});
  way["name"~"${term}",i]["tourism"](${bbox});
  way["name"~"${term}",i]["leisure"](${bbox});
);
out center body;`);
    }

    // No specific search — find all named businesses in area
    return `[out:json][timeout:15];
(
  node["name"]["amenity"](${bbox});
  node["name"]["shop"](${bbox});
  node["name"]["office"](${bbox});
  node["name"]["tourism"](${bbox});
  node["name"]["leisure"](${bbox});
  way["name"]["amenity"](${bbox});
  way["name"]["shop"](${bbox});
  way["name"]["office"](${bbox});
  way["name"]["tourism"](${bbox});
  way["name"]["leisure"](${bbox});
);
out center body;`
  }

  /**
   * Query Overpass API
   */
  private async queryOverpass(query: string): Promise<OverpassElement[]> {
    try {
      const res = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": USER_AGENT,
        },
        body: `data=${encodeURIComponent(query)}`,
      })

      if (!res.ok) return []

      const data = (await res.json()) as OverpassResponse
      return data.elements || []
    } catch {
      return []
    }
  }

  /**
   * Build a human-readable address from OSM tags
   */
  private buildAddress(tags: Record<string, string>): string {
    const parts: string[] = []

    const houseNumber = tags["addr:housenumber"]
    const street = tags["addr:street"]
    if (street) {
      parts.push(houseNumber ? `${houseNumber} ${street}` : street)
    }

    const city = tags["addr:city"]
    const state = tags["addr:state"]
    const postcode = tags["addr:postcode"]

    if (city) parts.push(city)
    if (state) parts.push(state)
    if (postcode) parts.push(postcode)

    if (parts.length === 0 && tags["addr:full"]) {
      return tags["addr:full"]
    }

    return parts.join(", ")
  }

  /**
   * Determine business category from tags
   */
  private getBusinessCategory(tags: Record<string, string>): string {
    if (tags.amenity) return tags.amenity
    if (tags.shop) return tags.shop
    if (tags.office) return tags.office
    if (tags.tourism) return tags.tourism
    if (tags.leisure) return tags.leisure
    return "business"
  }

  /**
   * Convert Overpass element to Lead
   */
  private elementToLead(
    element: OverpassElement,
    parsed: ParsedQuery,
    locationName: string
  ): Lead | null {
    const tags = element.tags
    if (!tags) return null

    const name = tags.name
    if (!name) return null

    // Get coordinates
    const lat = element.lat ?? element.center?.lat
    const lon = element.lon ?? element.center?.lon

    // Extract contact info
    const phone = tags.phone || tags["contact:phone"] || tags["contact:mobile"]
    const email = tags.email || tags["contact:email"]
    const website = tags.website || tags["contact:website"] || tags.url

    // Build address
    const address = this.buildAddress(tags)

    // Business category
    const category = this.getBusinessCategory(tags)

    // Build location string
    const location = address
      ? `${address}, ${locationName}`
      : locationName

    // Cuisine info (for restaurants)
    const cuisine = tags.cuisine

    // Opening hours
    const openingHours = tags.opening_hours

    // Build metadata
    const metadata: Record<string, unknown> = {
      source: "OpenStreetMap",
      osmId: element.id,
      osmType: element.type,
      category,
      lat,
      lon,
    }
    if (cuisine) metadata.cuisine = cuisine
    if (openingHours) metadata.openingHours = openingHours
    if (tags.brand) metadata.brand = tags.brand
    if (tags.operator) metadata.operator = tags.operator
    if (tags.description) metadata.description = tags.description

    // Confidence: higher if we have contact info
    let confidence = 0.6
    if (phone) confidence += 0.1
    if (email) confidence += 0.1
    if (website) confidence += 0.1
    if (address) confidence += 0.05
    confidence = Math.min(confidence, 0.95)

    return this.makeLead({
      firstName: "",
      lastName: "",
      company: name,
      title: category,
      email: email || undefined,
      phone: phone || undefined,
      website: website || undefined,
      location,
      confidence,
      tags: ["local", "openstreetmap", category],
      metadata,
    })
  }

  /**
   * Main search method
   */
  async search(query: string, options?: SearchOptions): Promise<Lead[]> {
    const parsed = this.parseQuery(query)

    // Step 1: Geocode the location
    const geoResult = await this.geocode(parsed.location)
    if (!geoResult) {
      // Fallback: try searching just the raw query as a location
      const fallback = await this.geocode(query)
      if (!fallback) return []
      return this.searchWithGeo({ ...parsed, location: query }, fallback)
    }

    return this.searchWithGeo(parsed, geoResult)
  }

  private async searchWithGeo(
    parsed: ParsedQuery,
    geo: NominatimResult
  ): Promise<Lead[]> {
    // Step 2: Build bbox string (south,west,north,east)
    const [south, north, west, east] = geo.boundingbox
    const bbox = `${south},${west},${north},${east}`

    // Step 3: Build and execute Overpass query
    const overpassQuery = this.buildOverpassQuery(parsed, bbox)
    const elements = await this.queryOverpass(overpassQuery)

    if (elements.length === 0) return []

    // Step 4: Convert to leads
    const locationName = geo.display_name.split(",").slice(0, 3).join(", ")
    const leads: Lead[] = []

    for (const element of elements) {
      const lead = this.elementToLead(element, parsed, locationName)
      if (lead) leads.push(lead)
    }

    // Sort by confidence descending
    leads.sort((a, b) => b.confidence - a.confidence)

    // Respect count limit
    const count = options?.count || leads.length
    return leads.slice(0, Math.min(count, 100))
  }

  async getCompany(domain: string): Promise<CompanyData | null> {
    // Try to find the business on OSM by searching its name
    const elements = await this.queryOverpass(
      `[out:json][timeout:10];
(
  node["website"~"${domain}",i];
  way["website"~"${domain}",i];
);
out center body;`
    )

    if (elements.length === 0) return null

    const el = elements[0]
    const tags = el.tags || {}
    const lat = el.lat ?? el.center?.lat
    const lon = el.lon ?? el.center?.lon

    return this.makeCompany({
      name: tags.name || domain.replace(/\.(com|io|co|org|net|de|fr|jp)$/, ""),
      domain,
      website: tags.website || `https://${domain}`,
      description: tags.description || `Business found via OpenStreetMap`,
      industry: this.getBusinessCategory(tags),
      headquarters: this.buildAddress(tags) || undefined,
      metadata: {
        source: "OpenStreetMap",
        osmId: el.id,
        lat,
        lon,
        phone: tags.phone || tags["contact:phone"],
        email: tags.email || tags["contact:email"],
        openingHours: tags.opening_hours,
      },
    })
  }

  async getContact(email: string): Promise<ContactData | null> {
    // Search OSM for entities with this email
    const elements = await this.queryOverpass(
      `[out:json][timeout:10];
(
  node["email"~"${email}",i];
  node["contact:email"~"${email}",i];
  way["email"~"${email}",i];
  way["contact:email"~"${email}",i];
);
out center body;`
    )

    if (elements.length === 0) return null

    const el = elements[0]
    const tags = el.tags || {}

    return {
      name: tags.name || email.split("@")[0],
      email,
      phone: tags.phone || tags["contact:phone"],
      company: tags.name,
      confidence: 0.6,
      source: this.name,
    }
  }
}

export default new OpenStreetMapSource()
