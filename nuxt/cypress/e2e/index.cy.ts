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
      cy.visit('/')
      cy.compareSnapshot('index')
    })
  })
})
