import 'cypress-file-upload';

describe('Home Page Accessibility', () => {
  it('Visits the Home Page', () => {
    cy.visit('/')
  })
})

describe('File Decode Test', () => {

  it('should upload a file to the input element', () => {
    // Visit the test page
    cy.visit('/');

    cy.get('input[type="file"]').as('fileInput');
    cy.fixture('AFG_adm0.kml').then(fileContent => {
      cy.get('@fileInput').attachFile({
        fileContent: fileContent,
        fileName: 'AFG_adm0.kml'
      });
    });

    cy.wait(5000);

  });
});
