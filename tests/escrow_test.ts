import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from '@solana/spl-token';
import { assert } from 'chai';
import { EscrowProject } from '../target/types/escrow_project';

describe('Escrow Project', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.EscrowProject as Program<EscrowProject>;

  let mint = null;
  let ownerTokenAccount = null;
  let escrowTokenAccount = null;
  let escrowAccount = anchor.web3.Keypair.generate();
  let user = anchor.web3.Keypair.generate();

  it('Initializes the escrow account with SPL tokens', async () => {
    // Airdrop some SOL to the user for testing
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL),
      "confirmed"
    );

    // Tworzenie tokena SPL
    mint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      9 // liczba miejsc dziesiętnych
    );

    // Tworzenie konta tokena dla właściciela
    ownerTokenAccount = await createAccount(provider.connection, user, mint, user.publicKey);

    // Mintowanie tokenów dla właściciela
    await mintTo(provider.connection, user, mint, ownerTokenAccount, user, 1000000);

    // Tworzenie konta tokena escrow
    escrowTokenAccount = await createAccount(provider.connection, user, mint, escrowAccount.publicKey);

    await program.rpc.initialize({
      accounts: {
        escrowAccount: escrowAccount.publicKey,
        user: user.publicKey,
        tokenAccount: escrowTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [escrowAccount, user]
    });

    const account = await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    assert.ok(account.owner.equals(user.publicKey));
    assert.equal(account.balance.toNumber(), 0);
  });

  it('Deposits SPL tokens into the escrow account', async () => {
    const depositAmount = new anchor.BN(500000); // 500,000 tokenów SPL

    await program.rpc.deposit(depositAmount, {
      accounts: {
        escrowAccount: escrowAccount.publicKey,
        owner: user.publicKey,
        ownerTokenAccount: ownerTokenAccount,
        escrowTokenAccount: escrowTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [user]
    });

    const account = await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    assert.equal(account.balance.toNumber(), depositAmount.toNumber());
  });

  it('Withdraws SPL tokens from the escrow account', async () => {
    const withdrawAmount = new anchor.BN(250000); // 250,000 tokenów SPL

    await program.rpc.withdraw(withdrawAmount, {
      accounts: {
        escrowAccount: escrowAccount.publicKey,
        owner: user.publicKey,
        ownerTokenAccount: ownerTokenAccount,
        escrowTokenAccount: escrowTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [user]
    });

    const account = await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    assert.equal(account.balance.toNumber(), 250000); // Pozostałe 250,000 tokenów SPL
  });
});
