// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('preencherCadastro', (firstName, lastName, email, phone, password) => {
  firstName && cy.get('#signup-firstname').type(firstName);
  lastName && cy.get('#signup-lastname').type(lastName);
  email && cy.get('#signup-email').type(email);
  phone && cy.get('#signup-phone').type(phone);
  password && cy.get('#signup-password').type(password);
  cy.get('#signup-button').click();
})

Cypress.Commands.add('limparCamposCadastro', () => {
  cy.get('#signup-firstname').clear();
  cy.get('#signup-lastname').clear();
  cy.get('#signup-email').clear();
  cy.get('#signup-phone').clear();
  cy.get('#signup-password').clear();
})

Cypress.Commands.add("buscarFilme", (pesquisa)=> {
    cy.get('#search-input').type(pesquisa);
    cy.get('#search-button').click();
})

Cypress.Commands.add("limparBusca", () => {
    cy.get('#clear-button').click();
})