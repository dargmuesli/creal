import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

import { COOKIE_CONTROL_DEFAULT } from '../../../utils/constants'

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

test.describe('a11y', () => {
  test('should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations.length).toEqual(2) // TODO: get rid of all violations
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
    expect(page.getByText(textEnglish)).toBeDefined()
  })

  test('displays German translations', async ({ page }) => {
    await page.goto('/de')
    expect(page.getByText(textGerman)).toBeDefined()
  })
})

test.describe('visual regression', () => {
  test('looks as before', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('is-loading')).toHaveAttribute(
      'data-is-loading',
      'false'
    )
    await page.getByRole('button', { name: 'Cookie control' }).isVisible()
    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('displays the cookie banner', async ({ context, page }) => {
    // TODO: only remove the cookie control cookie (https://github.com/microsoft/playwright/issues/10143)
    await context.clearCookies()

    await page.goto('/')
    await expect(page.getByTestId('is-loading')).toHaveAttribute(
      'data-is-loading',
      'false'
    )
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
