/// <reference types='cypress' />

/* 
  Para executar esses testes eu preferi usar dados mockados e escolhi o faker-js

  Para instalar essa biblioteca usem o comando `npm install @faker-js/faker` na pasta raiz do projeto (ou apenas npm install já que ele foi adicionado ao package.json)
*/

import { faker } from '@faker-js/faker/locale/pt_BR'

describe('US-012 - Funcionalidade: Cadastro de Usuários', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  afterEach(() => {
    cy.screenshot();
  })

  it('CT-01 + CT-04: Cadastro de Campos Obrigatórios', () => {
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      faker.internet.email().toLowerCase(), 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb());
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  });

  it('CT-02: Cadastro com E-mail Inválido', () => {
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      'emailinvalido.com', 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'E-mail deve ser um email válido')
  })

  it('CT-03 + CT-10: Cadastro Incompleto', () => {
    // Nome vazio
    cy.preencherCadastro(
      '', 
      faker.person.lastName(), 
      faker.internet.email().toLowerCase(), 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'Nome não pode estar vazio');
    cy.limparCamposCadastro();

    // Sobrenome vazio
    cy.preencherCadastro(
      faker.person.firstName(), 
      '', 
      faker.internet.email().toLowerCase(), 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'Sobrenome não pode estar vazio');
    cy.limparCamposCadastro();

    // Email Vazio
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      '', 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'E-mail não pode estar vazio');
    cy.limparCamposCadastro();

    // Senha Vazia
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      faker.internet.email().toLowerCase(), 
      faker.number.int(), 
      ''
    )
    cy.get('#signup-response').should('contain', 'Senha não pode estar vazia')
  })


  it('CT-05 + CT-06: Senha Fraca vs Senha Forte', () => {
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      faker.internet.email().toLowerCase(), 
      faker.number.int(), 
      '123456'
    )
    cy.get('#signup-response').should('contain', 'Senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, um número e um caractere especial (!@#$&*)')
    cy.limparCamposCadastro();

    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      faker.internet.email().toLowerCase(), 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  })

  it('CT-07: Cadastro com Email Duplicado', () => {
    const emailFixo = faker.internet.email().toLowerCase();

    // Primeiro cadastro - Deve funcionar normalmente
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      emailFixo, 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
    cy.limparCamposCadastro();

    // Segundo cadastro - Deve ser rejeitado pois acabamos de registrar com o email
    cy.preencherCadastro(
      faker.person.firstName(), 
      faker.person.lastName(), 
      emailFixo, 
      faker.number.int(), 
      faker.internet.password() + faker.color.rgb()
    )
    cy.get('#signup-response').should('contain', 'Este email já está cadastrado.')
  })

  // Adicionei essa linha pois esse erro existe no frontend, e estava atrapalhando o meu teste CT-09
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it('CT-09 - Política de Privacidade', () => {
    const privacyPolicyLink = cy.get('a');
    privacyPolicyLink.click();
    cy.get('h1').should('contain', 'Política de Privacidade')
  })
})

/*
  Eu pulei o US-015 pois só escrevi dois cenários de teste para ele, e eu não soube como testar..

  CT-01 - Navegação entre Recomendações: Não tem nenhum tipo de navegação entre recomendações, portanto, como testar?
  CT-02 - Atualização diária de recomendações: Aparentemente as recomendações estão hardcoded e não existe essa funcionalidade
*/
