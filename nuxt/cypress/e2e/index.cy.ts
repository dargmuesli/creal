describe('index page', () => {
  context('page load', () => {
    it('loads the page successfully', () => {
      cy.request('/').then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.redirectedToUrl).to.equal(undefined)
      })
    })
  })

  context('internationalization', () => {
    const textEnglish = 'DJ and event organizer'
    const textGerman = 'DJ und Event-Organisator'

    it('displays English translations', () => {
      cy.visit('/')
      cy.contains(textEnglish)
    })

    it('displays German translations', () => {
      cy.visit('/de')
      cy.contains(textGerman)
    })
  })

  context('visual regression', () => {
    it('looks as before', () => {
      cy.setCookie('ncc_c', 'clga')
      cy.visit('/')
      cy.get('[data-is-loading="false"]').should('be.visible')
      cy.get('[data-testid="nuxt-cookie-control-control-button"]').should(
        'be.visible'
      )
      cy.compareSnapshot('index')
    })
  })
})
