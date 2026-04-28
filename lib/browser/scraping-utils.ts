// Scraping Utilities for Playwright
// Common patterns for extracting structured data from web pages

import type { Page, ElementHandle } from 'playwright'

/**
 * Extract table data as an array of objects.
 * Uses the header row as keys.
 */
export async function scrapeTable(
  page: Page,
  selector: string
): Promise<Record<string, string>[]> {
  return page.$$eval(selector, (table) => {
    const t = table[0]
    if (!t) return []

    const headers = Array.from(t.querySelectorAll('thead th')).map(
      (th) => (th as HTMLElement).innerText.trim()
    )

    // If no thead, use first row as headers
    const headerCells =
      headers.length > 0
        ? headers
        : Array.from(t.querySelectorAll('tr:first-child td, tr:first-child th')).map(
            (cell) => (cell as HTMLElement).innerText.trim()
          )

    const rows = Array.from(t.querySelectorAll('tbody tr, tr')).slice(
      headers.length > 0 ? 0 : 1
    )

    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td')).map(
        (td) => (td as HTMLElement).innerText.trim()
      )
      const obj: Record<string, string> = {}
      headerCells.forEach((header, i) => {
        obj[header] = cells[i] || ''
      })
      return obj
    })
  })
}

/**
 * Extract list items as an array of strings
 */
export async function scrapeList(
  page: Page,
  selector: string
): Promise<string[]> {
  return page.$$eval(selector, (elements) =>
    elements.map((el) => (el as HTMLElement).innerText.trim()).filter(Boolean)
  )
}

/**
 * Extract structured data from card-like layouts.
 * Each card is matched by cardSelector, and within each card,
 * fieldSelectors map field names to CSS selectors (relative to the card).
 */
export async function scrapeCards(
  page: Page,
  cardSelector: string,
  fieldSelectors: Record<string, string>
): Promise<Record<string, string>[]> {
  const cards = await page.$$(cardSelector)
  const results: Record<string, string>[] = []

  for (const card of cards) {
    const data: Record<string, string> = {}
    for (const [field, selector] of Object.entries(fieldSelectors)) {
      try {
        const el = await card.$(selector)
        data[field] = el ? ((await el.textContent()) || '').trim() : ''
      } catch {
        data[field] = ''
      }
    }
    results.push(data)
  }

  return results
}

/**
 * Wait for an element to appear, then extract its text content
 */
export async function waitForAndExtract(
  page: Page,
  selector: string,
  timeout = 10000
): Promise<string | null> {
  try {
    await page.waitForSelector(selector, { timeout })
    const element = await page.$(selector)
    if (!element) return null
    return (await element.textContent())?.trim() || null
  } catch {
    return null
  }
}

/**
 * Handle infinite scroll pages by scrolling down repeatedly.
 * Returns the total number of scroll iterations performed.
 */
export async function infiniteScroll(
  page: Page,
  maxScrolls = 10,
  scrollDelay = 1000
): Promise<number> {
  let previousHeight = 0
  let scrollCount = 0

  for (let i = 0; i < maxScrolls; i++) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight)

    if (currentHeight === previousHeight) {
      // No new content loaded — we've reached the bottom
      break
    }

    previousHeight = currentHeight
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(scrollDelay)
    scrollCount++
  }

  return scrollCount
}

/**
 * Extract all email addresses found in text using regex
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex)
  if (!matches) return []

  // Deduplicate
  return [...new Set(matches.map((e) => e.toLowerCase()))]
}

/**
 * Extract all phone numbers found in text using regex.
 * Covers US, UK, international formats.
 */
export function extractPhones(text: string): string[] {
  const phoneRegex =
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g
  const matches = text.match(phoneRegex)
  if (!matches) return []

  // Filter out short matches that are likely not phone numbers
  return [
    ...new Set(
      matches
        .map((p) => p.trim())
        .filter((p) => p.replace(/\D/g, '').length >= 7)
    ),
  ]
}

/**
 * Extract all URLs found in text
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g
  const matches = text.match(urlRegex)
  if (!matches) return []
  return [...new Set(matches)]
}

/**
 * Scrape structured data from JSON-LD scripts on the page
 */
export async function scrapeJsonLd(
  page: Page
): Promise<Record<string, unknown>[]> {
  return page.evaluate(() => {
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    )
    return Array.from(scripts)
      .map((script) => {
        try {
          return JSON.parse(script.textContent || '{}')
        } catch {
          return null
        }
      })
      .filter(Boolean)
  })
}

/**
 * Scrape meta tags (Open Graph, Twitter Cards, etc.)
 */
export async function scrapeMetaTags(
  page: Page
): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const metaTags = document.querySelectorAll('meta[property], meta[name]')
    const result: Record<string, string> = {}
    metaTags.forEach((tag) => {
      const key =
        tag.getAttribute('property') || tag.getAttribute('name') || ''
      const value = tag.getAttribute('content') || ''
      if (key && value) result[key] = value
    })
    return result
  })
}

/**
 * Type text into an input field character by character (more human-like)
 */
export async function humanType(
  page: Page,
  selector: string,
  text: string,
  delayMs = 50
): Promise<void> {
  await page.click(selector)
  for (const char of text) {
    await page.keyboard.type(char, { delay: delayMs })
  }
}

/**
 * Extract text content from multiple elements and return as array
 */
export async function extractAll(
  page: Page,
  selector: string
): Promise<string[]> {
  const elements = await page.$$(selector)
  const results: string[] = []
  for (const el of elements) {
    const text = await el.textContent()
    if (text?.trim()) results.push(text.trim())
  }
  return results
}

/**
 * Check if an element exists on the page
 */
export async function elementExists(
  page: Page,
  selector: string
): Promise<boolean> {
  const element = await page.$(selector)
  return element !== null
}
