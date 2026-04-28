// Browser Automation Module using Playwright
// Provides headless browser capabilities for scraping JavaScript-rendered pages

import { chromium, Browser, Page, BrowserContext } from 'playwright'

export class BrowserAutomation {
  private browser: Browser | null = null
  private context: BrowserContext | null = null
  private initialized = false

  async init(): Promise<void> {
    if (this.initialized) return
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    this.context = await this.browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    this.initialized = true
  }

  async getPage(): Promise<Page> {
    if (!this.context) await this.init()
    return this.context!.newPage()
  }

  async navigate(url: string): Promise<Page> {
    const page = await this.getPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    return page
  }

  async scrape(
    url: string,
    selectors: Record<string, string>
  ): Promise<Record<string, string | string[]>> {
    const page = await this.navigate(url)
    const result: Record<string, string | string[]> = {}

    for (const [key, selector] of Object.entries(selectors)) {
      try {
        const elements = await page.$$(selector)
        if (elements.length === 0) {
          result[key] = ''
        } else if (elements.length === 1) {
          result[key] = (await elements[0].textContent()) || ''
        } else {
          result[key] = await Promise.all(
            elements.map((el) => el.textContent() || '')
          )
        }
      } catch {
        result[key] = ''
      }
    }

    await page.close()
    return result
  }

  async screenshot(url: string, _path?: string): Promise<Buffer> {
    const page = await this.navigate(url)
    const screenshot = await page.screenshot({ fullPage: true, type: 'png' })
    await page.close()
    return screenshot
  }

  async extractLinks(
    url: string
  ): Promise<Array<{ text: string; href: string }>> {
    const page = await this.navigate(url)
    const links = await page.$$eval('a[href]', (els) =>
      els.map((el) => ({
        text: (el as HTMLElement).innerText.trim(),
        href: (el as HTMLAnchorElement).href,
      }))
    )
    await page.close()
    return links
  }

  async extractText(url: string): Promise<string> {
    const page = await this.navigate(url)
    const text = await page.innerText('body')
    await page.close()
    return text
  }

  async fillForm(
    url: string,
    fields: Record<string, string>,
    submitSelector?: string
  ): Promise<Page> {
    const page = await this.navigate(url)
    for (const [selector, value] of Object.entries(fields)) {
      await page.fill(selector, value)
    }
    if (submitSelector) {
      await page.click(submitSelector)
      await page.waitForLoadState('networkidle')
    }
    return page
  }

  /**
   * Execute a custom script on a page and return the result
   */
  async evaluate<T>(url: string, fn: () => T): Promise<T> {
    const page = await this.navigate(url)
    const result = await page.evaluate(fn)
    await page.close()
    return result
  }

  /**
   * Run a callback with a page, handling lifecycle automatically
   */
  async withPage<T>(url: string, fn: (page: Page) => Promise<T>): Promise<T> {
    const page = await this.navigate(url)
    try {
      return await fn(page)
    } finally {
      await page.close()
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.context = null
      this.initialized = false
    }
  }
}

// Singleton instance
export const browser = new BrowserAutomation()

export default browser
