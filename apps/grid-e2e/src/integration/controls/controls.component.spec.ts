describe('grid', () => {
  beforeEach(() => cy.visit('/iframe.html?id=gridcontrolscomponent--primary&args=openControlPanelId:1;attributesHeading:Columns;searchPlaceHolder;searchToolTip;closeable:false;columns;searchQuery;'));
  it('should render the component', () => {
    cy.get('biosimulations-grid-controls').should('exist');
  });
});