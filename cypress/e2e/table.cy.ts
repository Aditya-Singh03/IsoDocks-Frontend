// For main page
describe("table test", () => {
  it("clear button works", () => {
    cy.visit("localhost:3000");
    cy.get("#username").type("Chris1010");
    cy.get('input[type="password"]').type("IsoNewengland12");
    cy.get("button").contains("Sign In").trigger("click");

    cy.get("#project").type("random project");

    cy.get("button").contains("Clear All").click();
    cy.get("#project").then(($text) => assert($text.text() === ""));

    cy.get("#resource").type("random resource");
    cy.get("#document").type("random doc");

    cy.get("button").contains("Clear All").click();
    cy.get("#resource").then(($text) => assert($text.text() === ""));
    cy.get("#document").then(($text) => assert($text.text() === ""));
  });

  it("Correct search", () => {
    cy.visit("localhost:3000");
    cy.get("#username").type("Chris1010");
    cy.get('input[type="password"]').type("IsoNewengland12");
    cy.get("button").contains("Sign In").trigger("click");

    cy.get("#customer").type("Constant");
    cy.get("button").contains("Search").trigger("click");
    cy.contains("Constant Energy").should("be.visible");
    // cy.contains("Lightening Power").should("not.be.visible");
  });

  it("Correct table sort", () => {
    cy.visit("localhost:3000");
    cy.get("#username").type("Chris1010");
    cy.get('input[type="password"]').type("IsoNewengland12");
    cy.get("button").contains("Sign In").trigger("click");

    cy.contains("Document Name").click();
    cy.contains("custacquisition_SR Aggregation.pdf").should("be.visible");
    // cy.contains("System Load and Capacity Projections.zip").should(
    //   "not.be.visible"
    // );
  });

  it("Correctly logs out", () => {
    cy.visit("localhost:3000");
    cy.get("#username").type("Chris1010");
    cy.get('input[type="password"]').type("IsoNewengland12");
    cy.get("button").contains("Sign In").trigger("click");

    cy.contains("Log Out").click();
    cy.contains("button", "Sign In").should("be.visible");
  });

  // it("Correctly downloads zips", () => {
  //   cy.visit("localhost:3000");
  //   cy.get("#username").type("Chris1010");
  //   cy.get('input[type="password"]').type("IsoNewengland12");
  //   cy.get("button").contains("Sign In").trigger("click");
  //   cy.contains("Solar Generator").click();
  //   cy.contains("Download 1 items").click();
  //   cy.readFile(
  //     "/users/caoji/OneDrive/Desktop/Classes/CS 320/ISODocs-Front-End--FBTB/cypress/downloads/documents.zip"
  //   ).should("exist");
  // });

  it("Correctly displays modal information", () => {
    cy.visit("localhost:3000");
    cy.get("#username").type("Chris1010");
    cy.get('input[type="password"]').type("IsoNewengland12");
    cy.get("button").contains("Sign In").trigger("click");
    cy.contains("Resource_info1.pdf").click();
    cy.contains("Resource_info1.pdf").should("be.visible");
    cy.contains("Project Name").should("be.visible");
    cy.contains("Project Type").should("be.visible");
    cy.contains("Customer").should("be.visible");
    cy.contains("Resource").should("be.visible");
    cy.contains("Commitment Period").should("be.visible");
    cy.contains("Auction Type").should("be.visible");
    cy.contains("Proposal Label").should("be.visible");
    cy.contains("Document Type").should("be.visible");
    cy.contains("File Size").should("be.visible");
  });
});
