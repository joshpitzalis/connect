describe('stats box', () => {
  it('lets me add stats', () => {
    cy.visit('/')
      .findByTestId('salesDashboard')
      .findByText(/configure your hustle meter/i)
      .click()
      .findByTestId('incomeStatement')
      .findByTestId('goal')
      .clear()
      .type(10000)
      .wait(2000)
      .findByTestId('average')
      .clear()
      .type(2000)
      .wait(2000)
      .findByTestId('income')
      .clear()
      .type(2465)
      .wait(2000)
      .findByText(
        'Landing 4 projects means you will need to pitch 12 leads, which means helping atleast 120 people.'
      )
      .findByTestId('close-button')
      .click({ force: true })
      .findByText('$ 2465')
      .findByTestId('statsTitle')
      .trigger('mouseover')
      .findByText('118')
      .findByText('12')
      .findByText('4');
  });

  // function move(testId, x, y) {
  //   cy.findByTestId(testId)
  //     .trigger('mousedown', { which: 1 })
  //     .trigger('mousemove', { clientX: x, clientY: y })
  //     .trigger('mouseup', { force: true });
  // }

  it('updates stats when I move people into or out of leads', () => {
    const fakeData = {
      name: 'Sick Rick',
    };
    cy.visit('/')
      .findByTestId('salesDashboard')
      .findByTestId('networkPage')
      .click()
      .findByTestId('outreachPage')
      .findByText(/add someone new/i)
      .click()
      .findByLabelText('name')
      .type(fakeData.name)
      .pickDate()
      .findByPlaceholderText(/notes/i)
      .type('this is a note')
      .queryByTestId('leadToggle')
      .should('not.exist')
      .findByText(/save/i)
      .click()
      .wait(5000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .findAllByText(fakeData.name)
      .first()
      .click()
      .findByTestId('leadToggle')
      .click()
      .findByTestId('close-button')
      .click({ force: true })
      .findByTestId('projectPage')
      .click()
      .findAllByTestId(fakeData.name)
      .findByText('$ 2465')
      .findByTestId('statsTitle')
      .trigger('mouseover')
      .findByText('118')
      .findByText('11')
      .findByText('10');
  });

  it.skip('updates stats when I move people into or out of project started', () => {
    cy.visit('/');
  });

  //   when columns are rearranged, leads are added to first column

  //   when columns are rearranged, projects are incremented of removed from last column

  //  // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js
});
