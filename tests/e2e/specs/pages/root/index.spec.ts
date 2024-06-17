import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

import { COOKIE_CONTROL_DEFAULT, PAGE_READY } from '../../../utils/constants'

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'ncc_c',
      value: COOKIE_CONTROL_DEFAULT,
      domain: 'localhost',
      path: '/',
    },
  ])
})

test.describe('accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/')
    await PAGE_READY({ page })
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    // expect(
    //   accessibilityScanResults.violations
    //     .map(
    //       (x) =>
    //         `${x.id}\n${x.nodes.map(
    //           (y) => `${y.failureSummary}\n(${y.html})`,
    //         )}`,
    //     )
    //     .join('\n'),
    // ).toEqual('')
    expect(accessibilityScanResults.violations.length).toEqual(0)
  })
})

test.describe('page load', () => {
  test('loads the page successfully', async ({ request }) => {
    const resp = await request.get('/')
    expect(resp.status()).toBe(200)
  })
})

test.describe('internationalization', () => {
  const textEnglish = 'DJ and event organizer'
  const textGerman = 'DJ und Event-Organisator'

  test('displays English translations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(textEnglish)).toBeVisible()
  })

  test('displays German translations', async ({ page }) => {
    await page.goto('/de')
    await expect(page.getByText(textGerman)).toBeVisible()
  })

  test('switches between English and German translations', async ({ page }) => {
    await page.goto('/')
    await PAGE_READY({ page })
    await expect(page.getByText(textEnglish).first()).toBeVisible()

    await page.getByLabel('Language').selectOption('de')
    await expect(page.getByText(textGerman).first()).toBeVisible()

    await page.getByLabel('Sprache').selectOption('en')
    await expect(page.getByText(textEnglish).first()).toBeVisible()
  })
})

test.describe('visual regression', () => {
  test('looks as before', async ({ page }) => {
    await page.goto('/')
    await PAGE_READY({ page })
    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('displays the cookie banner', async ({ context, page }) => {
    // TODO: only remove the cookie control cookie (https://github.com/microsoft/playwright/issues/10143)
    await context.clearCookies()

    await page.goto('/')
    await PAGE_READY({ page, options: { cookieControl: false } })
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
