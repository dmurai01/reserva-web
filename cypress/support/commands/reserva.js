import { faker } from '@faker-js/faker/locale/pt_BR'
let nome
let cpf
let celular
let pessoas
let data
let dataFormatada

Cypress.Commands.add('gerarCPF', () => {
    const geraNoveDigitos = () => {
        let nums;
        do {
            nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
        } while (nums.every(n => n === nums[0]));
        return nums;
    };

    const calcDigito = (nums, pesoInicial) => {
        const soma = nums.reduce((acc, num, i) => acc + num * (pesoInicial - i), 0);
        const resto = soma % 11;
        const dig = 11 - resto;
        return dig >= 10 ? 0 : dig;
    };

    const base = geraNoveDigitos();
    const d1 = calcDigito(base, 10);
    const d2 = calcDigito([...base, d1], 11);

    const cpfGerado = [...base, d1, d2].join("");

    return cpfGerado
})

Cypress.Commands.add('reservaComDadosValidos', (dataParam, cpfParam) => {
    cy.gerarCPF().then((cpfGerado) => {
        nome = `${faker.person.firstName()} ${faker.person.lastName()}`
        if (!cpfParam) {
            cpf = cpfGerado
        } else {
            cpf = cpfParam
        }
        celular = faker.string.numeric({ length: { min: 10, max: 11 } })
        pessoas = Math.floor(Math.random() * 4) + 1
        dataFormatada = dataParam

        if (!dataFormatada) {
            data = faker.date.future()
            dataFormatada = data.toISOString().split('T')[0];
        }

        cy.get('#fullName').click().clear().type(nome)
        cy.get('#cpf').click().clear().type(cpf)
        cy.get('#phone').click().clear().type(celular)
        cy.get('#peopleCount').click().clear().type(pessoas)
        cy.get('#reservationDate').click().type(dataFormatada)
        cy.contains('button', 'Reservar').click()

        return cy.wrap(cpf)
    })
})

Cypress.Commands.add('reservaCampoVazio', (parametro) => {
    cy.gerarCPF().then((cpfGerado) => {
        nome = `${faker.person.firstName()} ${faker.person.lastName()}`
        cpf = cpfGerado
        celular = faker.string.numeric({ length: { min: 10, max: 11 } })
        pessoas = Math.floor(Math.random() * 4) + 1
        data = faker.date.future()
        dataFormatada = data.toISOString().split('T')[0];

        if (parametro == 'nome') { cy.get('#fullName').click().clear() }else{ cy.get('#fullName').click().clear().type(nome) }
        if (parametro == 'cpf') { cy.get('#cpf').click().clear() } else { cy.get('#cpf').click().clear().type(cpf) }
        if (parametro == 'celular') { cy.get('#phone').click().clear() } else { cy.get('#phone').click().clear().type(celular) }
        if (parametro == 'pessoas') { cy.get('#peopleCount').click().clear() } else { cy.get('#peopleCount').click().clear().type(pessoas) }
        if (parametro == 'data') { cy.get('#reservationDate').click().clear() } else { cy.get('#reservationDate').click().type(dataFormatada) }
        cy.contains('button', 'Reservar').click()

        return cy.wrap(cpf)
    })
})