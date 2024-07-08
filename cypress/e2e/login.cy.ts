// For login page only
describe("login test", () => {
  it("user should not be able to log in with bad credentials", () => {
    cy.visit("localhost:3000");

    cy.get("#username").type("failuser1");
    cy.get('input[type="password"]').type("failpassword1");

    cy.get("button").contains("Sign In").click();
    cy.contains("button", "Sign In").should("be.visible");
  });

  it("user should not be able to log in with missing password", () => {
    cy.visit("localhost:3000");

    cy.get("#username").type("failuser1");

    cy.get("button").contains("Sign In").click();
    cy.contains("button", "Sign In").should("be.visible");
  });

  it("user should not be able to log in with missing username", () => {
    cy.visit("localhost:3000");

    cy.get('input[type="password"]').type("failpassword1");

    cy.get("button").contains("Sign In").click();
    cy.contains("button", "Sign In").should("be.visible");
  });

  it("user should be able to log in with valid credentials", () => {
    cy.visit("localhost:3000");

    cy.get("#username").type("Chris1010");
    cy.get('input[type="password"]').type("IsoNewengland12");

    cy.get("button").contains("Sign In").trigger("click");

    cy.contains("button", "Sign In").should("not.exist");
  });
});
