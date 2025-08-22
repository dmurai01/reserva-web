import { faker } from '@faker-js/faker/locale/pt_BR'

describe('Reserva', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('Criar uma reserva com a data de hoje com dados válidos deve retornar mensagem de sucesso (US01 - CT01)', () => {
    const hoje = new Date().toISOString().slice(0, 10);
    cy.reservaComDadosValidos(hoje)
    cy.get('#reserva-success').should('contain', 'Reserva confirmada com sucesso!')
  })

  it('Criar uma reserva com data futura e dados válidos deve retornar mensagem de sucesso (US01 - CT02)', () => {
    cy.reservaComDadosValidos()
    cy.get('#reserva-success').should('contain', 'Reserva confirmada com sucesso!')
  })

  it('Tentar criar uma reserva com CPF que já possui reserva ativa, deve retornar mensagem de erro (US01 - CT03)', () => {
    cy.reservaComDadosValidos().then((cpf) => {
      cy.wait(1000)
      cy.visit('/')
      cy.wait(1000)
      cy.reservaComDadosValidos('', cpf)
      cy.get('.error-message').should('contain', ' CPF já possui uma reserva ativa. Só será possível fazer nova reserva após a data da reserva atual.')
    })
  })

  it('Tentar criar uma reserva para uma data já preenchida com 5 reservas, deve retornar mensagem de erro (US01 - CT-04)', () => {
    const data = faker.date.future()
    const dataFormatada = data.toISOString().split('T')[0];

    for (let i = 0; i < 5; i++) {
      cy.reservaComDadosValidos(dataFormatada)
      cy.get('#reserva-success').should('contain', 'Reserva confirmada com sucesso!')
    }
    cy.visit('/')
    cy.reservaComDadosValidos(dataFormatada)
    cy.wait(1000)
    cy.get('.error-message').should('be.visible')
  })

  it('Tentar criar uma reserva com CPF inválido deve retornar mensagem de erro (US01 - CT05)', () => {
    cy.reservaComDadosValidos('', '12345678910')
    cy.get('.error-message').should('contain', 'CPF inválido')
  })

  it('Tentar criar uma reserva sem preencher nome deve retornar mensagem de erro (US01 - CT05)', () => {
    cy.reservaCampoVazio('nome')
    cy.get('.error-message').should('contain', 'Nome completo deve ter pelo menos 3 caracteres')
  })

  it('Tentar criar uma reserva sem preencher cpf deve retornar mensagem de erro (US01 - CT06)', () => {
    cy.reservaCampoVazio('cpf')
    cy.get('.error-message').should('contain', 'CPF inválido')
  })

  it('Tentar criar uma reserva sem preencher celular deve retornar mensagem de erro (US01 - CT07)', () => {
    cy.reservaCampoVazio('celular')
    cy.get('.error-message').should('contain', 'Telefone inválido (deve incluir DDD)')
  })

  it('Tentar criar uma reserva sem preencher quantidade de pessoas deve retornar mensagem de erro (US01 - CT08)', () => {
    cy.reservaCampoVazio('pessoas')
    cy.get('.error-message').should('contain', 'Quantidade de pessoas deve ser entre 1 e 4')
  })

  it('Tentar criar uma reserva sem preencher data deve retornar mensagem de erro (US01 - CT09)', () => {
    cy.reservaCampoVazio('data')
    cy.get('.error-message').should('contain', 'Data da reserva deve ser hoje ou uma data futura')
  })
})