const inquirer = require("inquirer");
const axios = require("axios");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGM1YmQ1NGVmY2JmNzM1M2UxNmEwMyIsImlhdCI6MTc2MzU4NzgyNSwiZXhwIjoxNzY2MTc5ODI1fQ.DIjX62KyYF7sauRF-HbIU0f-DuRih37dnyZAj6d1bFk";

const url =
  "http://localhost:3001/api/v1/book/689d02a29d9b7ecc7be8db53/core/ledgerGroup";

/*
// Example parent list from database or elsewhere
let parentGroups = [
  { id: "1", name: "Assets" },
  { id: "2", name: "Liabilities" },
  { id: "3", name: "Income" },
];

// Convert to Inquirer choices
const parentChoices = [
  { name: "No parent (root group)", value: "" },
  ...parentGroups.map((g) => ({ name: g.name, value: g.id })),
];
*/

let parentChoices = [{ name: "No parent (root group)", value: "" }];

async function askLedgerGroupQuestions() {
  console.log("----------NEXT-ONE----------");

  const answers = await inquirer.default.prompt([
    // 1. Ledger group name
    {
      type: "input",
      name: "name",
      message: "Enter ledger group name:",
      validate: (v) => (v ? true : "Name is required"),
    },

    // 2. Ledger group description
    {
      type: "input",
      name: "description",
      message: "Enter ledger group description:",
      validate: (v) => (v ? true : "Description is required"),
    },

    // 3. Parent selection
    {
      type: "select",
      name: "parentId",
      message: "Select parent ledger group:",
      choices: parentChoices,
    },

    // 4. Ledger group type IF no parent selected
    {
      type: "select",
      name: "nature",
      message: "Select ledger group nature:",
      choices: ["asset", "liability", "income", "expense"],
      when: (answers) => answers.parentId === "",
    },
  ]);

  console.log("\nInputs :", answers);

  const data = await a(
    answers.name,
    answers.description,
    answers.parentId,
    answers.nature
  );

  parentChoices = [...parentChoices, { name: data.name, value: data._id }];

  askLedgerGroupQuestions();
}

askLedgerGroupQuestions();

async function a(name, description, parentId, nature = "") {
  try {
    const response = await axios.post(
      url,
      { name, description, parentId, nature },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw error;
  }
}
