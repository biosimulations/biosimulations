describe('dispatch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should accept the cookies', () => {
    // accept the cookie prefrences
    cy.contains('Save').click();
  });
  it('should load main page', () => {
    cy.contains('Easily run biosimulations');
  });
  it('should load the run simulations page', () => {
    cy.get('.button-content').contains('Run a simulation').click();
    cy.url().should('includes', '/runs/new');
  });
  it('should load the your simulations page', () => {
    cy.get('.button-content').contains('Your simulation runs').click();
    cy.url().should('includes', '/runs');
  });
  it('should load the example simulations', () => {
    cy.get('.button-content').contains('Try simulation runs').click();
    cy.url().should('includes', '/runs?try=1');
    cy.contains('Budding yeast cell cycle (Irons, J Theor Biol, 2009');
  });
});
