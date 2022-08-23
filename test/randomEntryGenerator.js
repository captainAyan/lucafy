/**
 * This scripts lets you generate 10 entries using random ledgers.
 *
 * It fetches the list of all the ledgers and then creates 10 entries by
 * selecting ledgers randomly from that list.
 */

(async function () {
  const axios = require("axios");

  const testAuthToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZmFiNmJlNmNmODY4ZjNlN2MzMmVjZSIsImlhdCI6MTY2MDczMzM2MCwiZXhwIjoxNjYzMzI1MzYwfQ.hracnf9HIMkS-ryDWet6nstQvveymrsoSY5hkMR7qOQ";

  const { ledgers } = (
    await axios.get("http://localhost:3001/api/v1/ledger/all", {
      headers: {
        Authorization: "Bearer " + testAuthToken,
      },
    })
  ).data;

  for (let i = 0; i < 10; i++) {
    try {
      const debitLedger = ledgers[Math.floor(Math.random() * ledgers.length)];
      const creditLedger = ledgers[Math.floor(Math.random() * ledgers.length)];

      const debit_ledger_id = debitLedger._id;
      const credit_ledger_id = creditLedger._id;
      const amount = Math.floor(Math.random() * 100) * 10;
      const narration = `This is test generated entry No.${i}`;

      if (debit_ledger_id === credit_ledger_id) {
        i -= 1;
        continue;
      }

      const entry = (
        await axios.post(
          "http://localhost:3001/api/v1/entry",
          {
            debit_ledger_id,
            credit_ledger_id,
            amount,
            narration,
          },
          {
            headers: {
              Authorization: "Bearer " + testAuthToken,
              "Content-Type": "application/json",
            },
          }
        )
      ).data;

      console.log(`
      ${debitLedger.name} A/c ....................Dr      Rs.${amount}
        To.${creditLedger.name} A/c                                   Rs.${amount}
      (${narration})
      `);
    } catch (e) {
      console.log(e.message);
    }
  }
})();
