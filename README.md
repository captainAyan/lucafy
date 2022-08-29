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
## API Routes
### Authentication ✔️
1. /auth/login [POST] ✔️
2. /auth/register [POST] ✔️
### Profile ⌛
1. /profile [GET] ✔️
2. /profile [DELETE] ⌛
3. /profile [PUT] ✔️
### Ledger ✔️
1. /ledger [POST] : Create ledger ✔️
2. /ledger/:id [PUT] : Edit ledger name and type ✔️
3. /ledger [GET] : Get multiple ledgers ✔️ (Pagination)
4. /ledger/all [GET] : Get all ledgers ✔️
5. /ledger/:id [GET] : Get particular entry ✔️

**Model**: id, user id, created at, updated at, name, type, description, balance

**Note**: Balance is an internal field for holding the normalized value of ledger. The balance will not show up in the response. The current balance of the account (ledger) will not be provided in the response. For the balance of a ledger, use the Statement API (2nd point under the Statement head).
### Entry ✔️
1. /entry [POST] : Create journal entry ✔️
2. /entry/:id [PUT] : Edit journal entry ✔️
    - Only narration can be edited
3. /entry [GET] : Get multiple entries (Paginated) ✔️
4. /entry/:id [GET] : Get particular entry ✔️

**Model**: id, user id, created at, updated at, debit ledger id, credit ledger id, amount, narration
### Statement ⌛
1. /statement/trial-balance [GET] : View trial balance ⌛
2. /statement/ledger/:id [GET] : View ledger balance and associated entries ✔️

### Normalization ⌛
1. /normalize [POST] : Normalize all documents ⌛

## Frontend
### Pages Required
1. Login ✔️
2. Register ✔️
3. Profile (not an actual page) ✔️
    1. View Profile (i.e. profile)
    2. Edit Profile (i.e. profile/edit) ✔️
4. Ledger (not an actual page) ✔️
    1. Create Ledger (i.e. ledger) ✔️
    2. View Ledger (i.e. ledger/:id) [Note: this is the Ledger Statement as mentioned in the api doc] ✔️
    3. Edit Ledger (i.e. edit-ledger/:id) ✔️
5. Entry (not an actual page) ✔️
    1. Create Entry (i.e. entry) ✔️
    2. Edit Entry (i.e. entry/:id/edit) ✔️
    3. View Entry (i.e. entry/:id) ✔️
6. Statements (**Note**: the definition of *‘statement’* in the frontend may not be similar to the definition of *‘statement’* in the backend. That is, *‘statement’* in frontend means Journal [The book of entries. It contains all the entries]), and Trial balance statement.
    1. Journal ✔️
    2. Trial Balance ✔️ [This feature has NOT been implemented in the backend either]
