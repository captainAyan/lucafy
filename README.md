# Accounting Web
## Introduction
Accounting Web is a double entry application. It is a web app made using the MERN stack. ⚠️This is name is temporary.
## Features
### Overview
The user can
1. Create ledgers 📒
2. Add entries 📝
3. View those entries 📃
4. View ledger balances ⚖️
5. View statements 📃
#### Limitations
1. Users cannot create more than **20 ledgers** and **100 entries**.
2. Users must normalize the ledger balances after reaching the limit
    - Once the user reaches the limit of 100 journal entries, they can normalize the account to keep using the app.
    - On normalizing the accounts, it'll calculate the balance of each and every ledger and store them in the database field *balance*.
    - *Current ledger balances* are not stored in the database. Instead, they are calculated each time the user requests for them.
    - This *balance* field will be taken in to account for further calculations of the *current ledger balance*.
