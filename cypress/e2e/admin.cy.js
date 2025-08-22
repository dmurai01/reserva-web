describe('Admin', () => {
    beforeEach(() => {
        cy.visit('/admin.html')
    });
    it('Fazer login com credenciais válidas deve entrar no Painel Administrativo (US02 - CT01)', () => {
        cy.loginValido()
        cy.get(':nth-child(1) > h3').should('contain', 'Reservas Hoje')
    });

    it('Fazer login com credenciais inválidas deve mostrar mensagem de erro (US02 - CT02)', () => {
        cy.loginInvalido()
        cy.get('#admin-login-error').should('contain', 'Usuário ou senha inválidos')
    });

    it('Ao entrar no painel com credenciais válidas, deve mostrar a lista de reservas do dia (US02 - CT03)', () => {
        cy.loginValido()
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // mês começa em 0
        const ano = hoje.getFullYear();

        const hojeFormatado = `${dia}/${mes}/${ano}`;

        cy.get('#reservas-list > h3').should('contain', 'Reservas de hoje')
        cy.get('.reservation-date').should('contain', hojeFormatado)
    });

});