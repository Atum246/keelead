// KeeLead Data Source System — Core Types

export interface Lead {
  id?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  website?: string
  linkedin?: string
  twitter?: string
  location?: string
  source: string
  confidence: number
  verified?: boolean
  tags?: string[]
  metadata?: Record<string, unknown>
}

export interface CompanyData {
  name: string
  domain?: string
  description?: string
  industry?: string
  size?: string
  founded?: string
  headquarters?: string
  revenue?: string
  website?: string
  logo?: string
  techStack?: string[]
  socialMedia?: Record<string, string>
  keyPeople?: Person[]
  funding?: FundingRound[]
  metadata?: Record<string, unknown>
}

export interface ContactData {
  name: string
  email?: string
  phone?: string
  title?: string
  company?: string
  linkedin?: string
  twitter?: string
  location?: string
  confidence: number
  source: string
}

export interface Person {
  name: string
  title: string
  email?: string
  linkedin?: string
  confidence: number
}

export interface FundingRound {
  round: string
  amount: string
  date: string
  investors: string[]
}

export interface SearchOptions {
  count?: number
  location?: string
  industry?: string
  title?: string
  company?: string
  [key: string]: unknown
}

export interface DataSource {
  name: string
  id: string
  category: string
  requiresApiKey: boolean
  rateLimit: number // requests per minute
  enabled: boolean
  search(query: string, options?: SearchOptions): Promise<Lead[]>
  getCompany?(domain: string): Promise<CompanyData | null>
  getContact?(email: string): Promise<ContactData | null>
}

export type SourceCategory =
  | "search"
  | "professional"
  | "company"
  | "local"
  | "social"
  | "developer"
  | "startup"
  | "government"
  | "education"
  | "email"
  | "events"
