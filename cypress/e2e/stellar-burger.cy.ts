describe('проверяем доступность приложения', function () {
  it('Маршрут №1', function () {
    cy.intercept(`https://norma.nomoreparties.space/api/ingredients`, {
      fixture: 'ingredients.json'
    });

    cy.intercept(`https://norma.nomoreparties.space/api/orders/all`, {
      fixture: 'feed.json'
    });

    cy.intercept(`https://norma.nomoreparties.space/api/orders/2`, {
      fixture: 'orderByNumber.json'
    });

    cy.intercept(
      {
        method: 'POST',
        url: `https://norma.nomoreparties.space/api/orders`
      },
      {
        fixture: 'order.json'
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: `https://norma.nomoreparties.space/api/orders`
      },
      {
        fixture: 'feed.json'
      }
    );

    cy.intercept(`https://norma.nomoreparties.space/api/auth/login`, {
      fixture: 'auth.json'
    });

    cy.visit('http://localhost:4000');

    for (let index = 1; index < 6; index++) {
      cy.get(`[data-cy=elem_${index}] .text_type_main-default`).contains(
        `Ингредиент_${index}`
      );
      cy.get(`[data-cy=elem_${index}] .mt-8`).click();
    }

    for (let index = 1; index < 6; index++) {
      if (index != 3) {
        cy.get(
          `[data-cy=construcor_ingredient_${index}] .constructor-element__text`
        ).contains(`Ингредиент_${index}`);
      }
    }

    cy.get('[data-cy=submit_order] .button').click();

    cy.get(`[data-cy=login_form] [type=email]`).type('John@yandex.ru');
    cy.get(`[data-cy=login_form] [type=password]`).type('somepassword1234');

    cy.get(`[data-cy=login_form] [type=submit]`).click();

    cy.get('[data-cy=username]').contains('John');

    cy.get('[data-cy=submit_order] .button').click();

    cy.get('#modals .text_type_main-medium').contains('идентификатор заказа');
    cy.get('#modals h2').contains('3');
    cy.get('#modals [type=button]').click();

    cy.get('[data-cy=take_bun]');
    cy.get('[data-cy=take_filling]');

    for (let index = 1; index < 6; index++) {
      cy.get(`[data-cy=elem_${index}] .text_type_main-default`).contains(
        `Ингредиент_${index}`
      );
      cy.get(`[data-cy=elem_${index}] .mt-8`).click();
    }

    cy.get('[data-cy=submit_order] .button').click();
    cy.get('[data-cy=modal_close]').click({ force: true });

    cy.get(`[data-cy=elem_${1}]`).click();

    cy.get(`#modals h3`).contains('Ингредиент_1');

    const firstIngredient = ['42', '65', '62', '96'];

    for (let index = 1; index < 5; index++) {
      cy.get(`#modals ul li:nth-child(${index}) p:nth-child(2)`).contains(
        firstIngredient[index - 1]
      );
    }

    cy.get('#modals [type=button]').click();

    cy.get('[data-cy=feed]').click();

    cy.get('[data-cy=feed_elem_2]').click();

    cy.get('#modals h3').contains('Супер бургер');

    cy.get('#modals [type=button]').click();

    cy.get('[data-cy=username]').click();

    cy.get('[data-cy=history]').click();

    cy.get('[data-cy=feed_elem_2]').click();

    cy.get('#modals h3').contains('Супер бургер');

    cy.get('#modals [type=button]').click();
  });
});
