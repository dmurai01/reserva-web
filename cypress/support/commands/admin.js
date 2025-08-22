Cypress.Commands.add('loginValido', () => {
    cy.fixture('credenciais').then(credenciais => {
        cy.get('#username').click().clear().type(credenciais.valida.username)
        cy.get('#password').click().clear().type(credenciais.valida.password)
    })

    cy.contains('button', 'Entrar').click()
})

Cypress.Commands.add('loginInvalido', () => {
    cy.fixture('credenciais').then(credenciais => {
        cy.get('#username').click().clear().type(credenciais.invalida.username)
        cy.get('#password').click().clear().type(credenciais.invalida.password)
    })

    cy.contains('button', 'Entrar').click()
})