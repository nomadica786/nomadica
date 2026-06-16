import { browser } from 'k6/browser'
import { check } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js'

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
}

export default async function () {
  const page = await browser.newPage()

  try {
    await page.goto('https://quickpizza.grafana.com/admin', {
      waitFor: 'networkidle',
    })

    await page.getByLabel(/Username/i).fill('admin')
    await page.getByLabel(/Password/i).fill('admin')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Wait for the logout button to be visible
    await page.getByRole('button', { name: 'Logout' }).waitFor()

    const label = page.locator('h2')
    const textContent = (await label.textContent()).trim()
    check(textContent, {
      header: (t) => t === 'Latest pizza recommendations',
    })
  } finally {
    await page.close()
  }
}
