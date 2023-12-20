import 'cypress-file-upload';

describe('Home Page Accessibility', () => {
  it('Visits the Home Page', () => {
    cy.visit('/')
  })
})

describe('Community Pop-Up Test', () => {

  it('Should open Community Pop-Up and ', () => {
    // Visit the test page
    cy.visit('/');

    cy.get('.component-top-left').click();

    cy.wait(5000);

  });
});

describe('Login Test', () => {

  it('Should login the test account and open user profile.', () => {
    // Visit the test page
    cy.visit('/');

    cy.get('.component-top-right').click();

    cy.wait(2000);

    cy.origin('https://zaunmap.us.auth0.com', () => {
      cy.get('#username').type('example@example.com');
      cy.get('#password').type('QraHcL^3NG8AETW%');
      cy.get('button[type="submit"][name="action"][data-action-button-primary="true"]').click();
    })

    cy.wait(5000);

    cy.get('.component-top-right').click();

    cy.wait(1000);

    cy.get('.admin-page').should('not.exist');

  });
});

describe('Unauthorized Access to Admin Portal without login', () => {

  it('Attempt to access Admin Portal while not logged in.', () => {
    // Visit the test page

    cy.visit('/');
    cy.visit('/admin');
    cy.wait(1000);

    cy.get('.admin-page').should('not.exist');

  });
});


describe('Unauthorized Access to Admin Portal with normal user', () => {

  it('Attempt to access Admin Portal while not logged in.', () => {
    // Visit the test page
    cy.visit('/');

    cy.get('.component-top-right').click();

    cy.wait(2000);

    cy.origin('https://zaunmap.us.auth0.com', () => {
      cy.get('#username').type('example@example.com');
      cy.get('#password').type('QraHcL^3NG8AETW%');
      cy.get('button[type="submit"][name="action"][data-action-button-primary="true"]').click();
    })

    cy.wait(5000);

    cy.visit('/admin');

    cy.get('.admin-page').should('not.exist');

  });
});

describe('Create a Map Test', () => {

  it('Create a map as logged-in user.', () => {
    // Visit the test page
    cy.visit('/');

    cy.get('.component-top-right').click();

    cy.wait(2000);

    cy.origin('https://zaunmap.us.auth0.com', () => {
      cy.get('#username').type('example@example.com');
      cy.get('#password').type('QraHcL^3NG8AETW%');
      cy.get('button[type="submit"][name="action"][data-action-button-primary="true"]').click();
    })

    cy.wait(5000);

    cy.get('.component-bottom-right').click();

    cy.get('.file-uploader-buttons').click();

    cy.wait(3000);
    
    cy.get('.btn-close').click();

    cy.wait(3000);

    cy.get('.component-top-right').click();

    cy.wait(1000);

    cy.get('.text-danger').should('exist');

  });
});

describe('Create then Delete a Map Test', () => {

  it('Create a map as logged-in user and then delete it.', () => {
    // Visit the test page
    cy.visit('/');

    cy.get('.component-top-right').click();

    cy.wait(2000);

    cy.origin('https://zaunmap.us.auth0.com', () => {
      cy.get('#username').type('example@example.com');
      cy.get('#password').type('QraHcL^3NG8AETW%');
      cy.get('button[type="submit"][name="action"][data-action-button-primary="true"]').click();
    })

    cy.wait(5000);

    cy.get('.component-bottom-right').click();

    cy.get('.file-uploader-buttons').click();

    cy.wait(3000);
    
    cy.get('.btn-close').click();

    cy.wait(3000);

    cy.get('.component-top-right').click();

    cy.wait(1000);

    cy.get('.text-danger').should('exist');

  });

});