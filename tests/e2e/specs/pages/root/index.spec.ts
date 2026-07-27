import { vioTest } from '@dargmuesli/nuxt-vio-testing/e2e/fixtures/vioTest'
import {
  testA11y,
  testOgImage,
  testPageLoad,
  testVisualRegression,
} from '@dargmuesli/nuxt-vio-testing/e2e/utils/tests'
import { PAGE_READY } from '@dargmuesli/nuxt-vio-testing/e2e/utils/constants'
import { expect } from '@playwright/test'

const PAGE_PATH = '/'

testA11y(PAGE_PATH)
testOgImage({
  dynamic: {
    de: 'a_~RWluIEJpbGQgdm9uIERKIGNSZWFsLCBzZWluIExvZ28gdW5kIE5hbWUgc293aWUgZGVyIFRpdGVsIGRlciBTZWl0ZS4,c_Default.takumi,description_DJ+cReals+Webseite.,title_cReal,headline_DJ+und+Event-Organisator,p_Ii9kZSI,s_o4ri_f3VWLu1k36B.png',
    en: `a_~QSBwaWN0dXJlIG9mIERKIGNSZWFsLCBoaXMgbG9nbyBhbmQgbmFtZSBhcyB3ZWxsIGFzIHBhZ2UncyB0aXRsZS4,c_Default.takumi,description_DJ+cReal's+website.,title_cReal,headline_DJ+and+event+organizer,s_dni6-DWD765dGH3t.png`,
  },
})
testPageLoad(PAGE_PATH)
testVisualRegression(PAGE_PATH)

vioTest.describe('internationalization', () => {
  const textEnglish = 'DJ and event organizer'
  const textGerman = 'DJ und Event-Organisator'

  vioTest('displays English translations', async ({ defaultPage }) => {
    await defaultPage.goto('/')
    await expect(defaultPage.page.getByText(textEnglish)).toBeVisible()
  })

  vioTest('displays German translations', async ({ defaultPage }) => {
    await defaultPage.goto('/de')
    await expect(defaultPage.page.getByText(textGerman)).toBeVisible()
  })

  vioTest(
    'switches between English and German translations',
    async ({ defaultPage }) => {
      await defaultPage.goto('/')
      await PAGE_READY({
        page: defaultPage.page,
        options: { cookieControl: false },
      })
      await expect(
        defaultPage.page.getByText(textEnglish).first(),
      ).toBeVisible()

      await defaultPage.page.getByLabel('Language').selectOption('de')
      await expect(defaultPage.page.getByText(textGerman).first()).toBeVisible()

      await defaultPage.page.getByLabel('Sprache').selectOption('en')
      await expect(
        defaultPage.page.getByText(textEnglish).first(),
      ).toBeVisible()
    },
  )
})

vioTest.describe('visual regression', () => {
  vioTest('displays the cookie banner', async ({ page }) => {
    await page.goto('/')
    await PAGE_READY({ page, options: { cookieControl: false } })
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
