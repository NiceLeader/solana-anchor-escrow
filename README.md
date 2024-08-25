
# Solana Anchor Escrow Project

This project implements an escrow smart contract on the Solana blockchain using the Anchor framework. The escrow contract securely holds SPL tokens on behalf of users until certain conditions are met, allowing only the owner of the escrow account to deposit and withdraw funds.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Deploying the Contract](#deploying-the-contract)
- [Running Tests](#running-tests)
- [Directory Structure](#directory-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project implements the Escrow pattern on the Solana blockchain using the Anchor framework. The escrow contract acts as a trusted third party that securely holds SPL tokens until the owner withdraws them. The contract allows multiple users to create and manage their escrow accounts independently.

## Features

- **Multiple Users:** Supports multiple users with individual escrow accounts.
- **SPL Token Support:** Handles deposits and withdrawals of SPL tokens, the standard token type on the Solana blockchain.
- **Owner-Only Withdrawals:** Ensures that only the owner of the escrow account can withdraw funds.
- **Security:** Protects against unauthorized access and checks for sufficient funds during withdrawals.
- **Comprehensive Tests:** Includes unit and end-to-end tests in TypeScript using Mocha and Chai.

## Prerequisites

Ensure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://book.anchor-lang.com/chapter_2/installation.html)
- Node.js (version 16 or higher)
- Yarn or npm

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/NiceLeader/solana-anchor-escrow.git
    cd solana-anchor-escrow
    ```

2. Install the dependencies:

    ```bash
    yarn install
    ```

3. Build the project:

    ```bash
    anchor build
    ```

## Running the Project

1. Start a local Solana test validator:

    ```bash
    solana-test-validator
    ```

2. Deploy the contract locally:

    ```bash
    anchor deploy
    ```

3. The deployment will output a program ID, which you should update in your `Anchor.toml` if needed.

## Deploying the Contract

To deploy the contract on Devnet or Testnet:

1. Configure the network in `Anchor.toml`:

    For Devnet:

    ```toml
    [provider]
    cluster = "https://api.devnet.solana.com"
    wallet = "~/.config/solana/id.json"
    ```

    For Testnet:

    ```toml
    [provider]
    cluster = "https://api.testnet.solana.com"
    wallet = "~/.config/solana/id.json"
    ```

2. Deploy the contract:

    ```bash
    anchor deploy
    ```

## Running Tests

To run the tests, use:

```bash
anchor test
```

Tests are written in TypeScript and located in the `tests/escrow.ts` file. They cover the following scenarios:

- Initializing an escrow account
- Depositing SPL tokens into the escrow account
- Withdrawing SPL tokens from the escrow account
- Handling errors such as insufficient funds or unauthorized access

## Directory Structure

```plaintext
solana-anchor-escrow/
│
├── migrations/          # Deployment scripts
├── programs/            # Smart contract code
│   └── solana_anchor_escrow/
│       └── src/
│           └── lib.rs   # Main contract logic
├── tests/               # Test files
│   └── escrow.ts        # Tests for the contract
├── Anchor.toml          # Anchor configuration file
└── README.md            # This file
```

## How It Works

### Contract Logic

The contract is written in Rust using the Anchor framework and implements the following functionality:

- **Initialize:** Creates a new escrow account for a user, storing the owner’s public key and associated SPL token account.
- **Deposit:** Allows the owner to deposit SPL tokens into their escrow account.
- **Withdraw:** Allows the owner to withdraw tokens from their escrow account.

### Security

The contract includes checks to ensure that:

- Only the owner of an escrow account can withdraw funds.
- Withdrawals cannot exceed the available balance.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
