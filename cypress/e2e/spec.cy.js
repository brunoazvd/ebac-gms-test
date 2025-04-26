/// <reference types='cypress' />

/* 
  Para executar esses testes eu preferi usar dados mockados e escolhi o faker-js

  Para instalar essa biblioteca usem o comando `npm install @faker-js/faker` na pasta raiz do projeto (ou apenas npm install já que ele foi adicionado ao package.json)
*/

import { faker } from '@faker-js/faker/locale/pt_BR'


describe('US-012 - Funcionalidade: Cadastro de Usuários', () => {
  it('CT-01 + CT-04: Cadastro de Campos Obrigatórios', () => {
    cy.visit('http://127.0.0.1:8080/');
    cy.get('#signup-firstname').type(faker.person.firstName());
    cy.get('#signup-lastname').type(faker.person.lastName());
    cy.get('#signup-email').type(faker.internet.email().toLowerCase());
    cy.get('#signup-phone').type(faker.number.int())
    cy.get('#signup-password').type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    cy.get('#signup-button').click();
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  });

  it('CT-02: Cadastro com E-mail Inválido', () => {
    cy.visit('http://127.0.0.1:8080/');
    cy.get('#signup-firstname').type(faker.person.firstName());
    cy.get('#signup-lastname').type(faker.person.lastName());
    cy.get('#signup-email').type('emailinvalido.com');
    cy.get('#signup-phone').type(faker.number.int())
    cy.get('#signup-password').type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    cy.get('#signup-button').click();
    cy.get('#signup-response').should('contain', 'E-mail deve ser um email válido')
  })

  it('CT-03 + CT-10: Cadastro Incompleto', () => {
    cy.visit('http://127.0.0.1:8080/');
    const firstNameField = cy.get('#signup-firstname');
    const lastNameField = cy.get('#signup-lastname');
    const emailField =  cy.get('#signup-email');
    const passwordField = cy.get('#signup-password');
    const submitButton = cy.get('#signup-button');
    const clearAllFields = () => {
      firstNameField.clear();
      lastNameField.clear();
      emailField.clear();
      passwordField.clear();
    }

    // Nome vazio
    lastNameField.type(faker.person.lastName());
    emailField.type(faker.internet.email().toLowerCase());
    passwordField.type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Nome não pode estar vazio');
    clearAllFields();

    // Sobrenome vazio
    firstNameField.type(faker.person.firstName());
    emailField.type(faker.internet.email().toLowerCase());
    passwordField.type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Sobrenome não pode estar vazio');
    clearAllFields();

    // Email Vazio
    firstNameField.type(faker.person.firstName());
    lastNameField.type(faker.person.lastName());
    passwordField.type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'E-mail não pode estar vazio');
    clearAllFields();

    // Senha Vazia
    firstNameField.type(faker.person.firstName());
    lastNameField.type(faker.person.lastName());
    emailField.type(faker.internet.email().toLowerCase());
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Senha não pode estar vazia')
  })


  it('CT-05 + CT-06: Senha Fraca vs Senha Forte', () => {
    cy.visit('http://127.0.0.1:8080/');
    const firstNameField = cy.get('#signup-firstname');
    const lastNameField = cy.get('#signup-lastname');
    const emailField =  cy.get('#signup-email');
    const passwordField = cy.get('#signup-password');
    const submitButton = cy.get('#signup-button');

    firstNameField.type(faker.person.firstName());
    lastNameField.type(faker.person.lastName());
    emailField.type(faker.internet.email().toLowerCase());
    passwordField.type('123456');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, um número e um caractere especial (!@#$&*)')

    passwordField.clear();
    passwordField.type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  })

  it('CT-07: Cadastro com Email Duplicado', () => {
    cy.visit('http://127.0.0.1:8080/');
    const firstNameField = cy.get('#signup-firstname');
    const lastNameField = cy.get('#signup-lastname');
    const emailField =  cy.get('#signup-email');
    const passwordField = cy.get('#signup-password');
    const submitButton = cy.get('#signup-button');

    const clearAllFields = () => {
      firstNameField.clear();
      lastNameField.clear();
      emailField.clear();
      passwordField.clear();
    }

    const emailFixo = faker.internet.email().toLowerCase();

    // Primeiro cadastro - Deve funcionar normalmente
    firstNameField.type(faker.person.firstName());
    lastNameField.type(faker.person.lastName());
    emailField.type(emailFixo);
    passwordField.type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')

    clearAllFields();


    // Segundo cadastro - Deve ser rejeitado pois acabamos de registrar com o email
    firstNameField.type(faker.person.firstName());
    lastNameField.type(faker.person.lastName());
    emailField.type(emailFixo);
    passwordField.type(faker.color.human().toUpperCase() + faker.color.rgb()+'0');
    submitButton.click();
    cy.get('#signup-response').should('contain', 'Este email já está cadastrado.')
  })

  // Adicionei essa linha pois esse erro existe no frontend, e estava atrapalhando o meu teste CT-09
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it('CT-09 - Política de Privacidade', () => {
    cy.visit('http://127.0.0.1:8080/');
    const privacyPolicyLink = cy.get('a');
    privacyPolicyLink.click();
    cy.get('h1').should('contain', 'Política de Privacidade')
  })
})

describe('US-001 - Busca de Filmes', () => {
  it('CT-01 + CT-06: Busca Válida -> Limpar Busca', () => {
    cy.visit('http://127.0.0.1:8080/');
    const searchInput = cy.get('#search-input');
    const searchButton = cy.get('#search-button');
    const clearButton = cy.get('#clear-button');


    searchInput.type('drama');
    searchButton.click();


    // garantir que existem resultados e cada um possui imagem e titulo
    cy.get('#results-section > div').should('have.length.greaterThan', 0);
    cy.get('#results-section > div').each(($el) => {
      cy.wrap($el).within(() => {
        cy.get('h3').should('exist');
        cy.get('img').should('exist');
      });
    });

    // limpou a busca
    clearButton.click();

    // garantir que resultados sumiram
    cy.get('#results-section > div').should('have.length', 0)
  })

  it('CT-04: Busca vazia', () => {
    cy.visit('http://127.0.0.1:8080/');
    const searchButton = cy.get('#search-button');

    cy.on('window:alert', (txt) => {
      expect(txt).to.equal('Por favor, digite o nome de um filme'); // ou o texto real que seu alerta exibe
    });
    searchButton.click();

  })

  it('CT-02: Busca Inválida', () => {
    cy.visit('http://127.0.0.1:8080/');
    const searchInput = cy.get('#search-input');
    const searchButton = cy.get('#search-button');

    searchInput.type('dasmhdkasdhakshdka')
    searchButton.click();

    cy.get('#results-section').should('contain', 'Filme não encontrado.')
  })

  /* Eu pulei os CT-03 e CT-05 pois não sabia como testa-los.

  CT-03 - Busca em Tempo Real: Não funciona dessa forma
  CT-05 - Busca com mais de 10 resultados: Não foi implementado nem paginação nem rolagem infinita
  */
})

/*
  Eu pulei o US-015 pois só escrevi dois cenários de teste para ele, e eu não soube como testar..

  CT-01 - Navegação entre Recomendações: Não tem nenhum tipo de navegação entre recomendações, portanto, como testar?
  CT-02 - Atualização diária de recomendações: Aparentemente as recomendações estão hardcoded e não existe essa funcionalidade
*/
