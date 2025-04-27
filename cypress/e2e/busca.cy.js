/// <reference types='cypress' />


describe('US-001 - Busca de Filmes', () => {
    beforeEach(() => {
      cy.visit('/');
    })
  
    it('CT-01 + CT-06: Busca Válida -> Limpar Busca', () => {
      cy.buscarFilme('Batman');
  
      let resultados = cy.get('#results-section > div')
      // garantir que ao menos o primeiro resultado possui a palavra chave buscada

      resultados.first().within(() => {
        cy.get('h3').should('contain', 'Batman');
      });

      // garantir que existem resultados e cada um possui imagem e titulo
      resultados.should('have.length.greaterThan', 0);
      resultados.each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('h3').should('exist');
          cy.get('img').should('exist');
        });
      });
  
      // limpou a busca
      cy.limparBusca();
  
      // garantir que resultados sumiram
      cy.get('#results-section > div').should('have.length', 0)
    })

    it('CT-XX - Busca de filmes de uma lista', () => {
        cy.fixture('filmes.json').then((filmes) => {
            filmes.forEach((filme) => {
                cy.buscarFilme(filme.titulo);
                const resultados = cy.get('#results-section > div')
                resultados.should('have.length.greaterThan', 0);
                resultados.first().within(() => {
                    cy.get('h3').should('contain', filme.titulo);
                    cy.get('img').should('exist');
                });
                cy.limparBusca();
            });
        });

    })
  
    it('CT-04: Busca vazia', () => {
      const searchButton = cy.get('#search-button');
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.equal('Por favor, digite o nome de um filme'); // ou o texto real que seu alerta exibe
      });
      searchButton.click();
  
    })
  
    it('CT-02: Busca Inválida', () => {
      cy.buscarFilme('dasmhdkasdhakshdka')
      cy.get('#results-section').should('contain', 'Filme não encontrado.')
    })
  
    /* Eu pulei os CT-03 e CT-05 pois não sabia como testa-los.
  
    CT-03 - Busca em Tempo Real: Não funciona dessa forma
    CT-05 - Busca com mais de 10 resultados: Não foi implementado nem paginação nem rolagem infinita
    */
  })
  