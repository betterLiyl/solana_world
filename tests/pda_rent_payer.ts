import * as anchor from '@coral-xyz/anchor';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { assert } from 'chai';
import type { PdaRentPayer } from '../target/types/pda_rent_payer';

describe('PDA Rent-Payer', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;
  const program = anchor.workspace.PdaRentPayer as anchor.Program<PdaRentPayer>;

  // PDA for the Rent Vault
  const [rentVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from('rent_vault')], program.programId);
  console.log(`Rent Vault PDA: ${rentVaultPDA}`);
  it('Initialize the Rent Vault', async () => {
    // 1 SOL
    const fundAmount = new anchor.BN(LAMPORTS_PER_SOL);

    await program.methods
      .initRentVault(fundAmount)
      .accounts({
        payer: wallet.publicKey,
        rentVault: rentVaultPDA,
      })
      .rpc();

    // Check rent vault balance
    const accountInfo = await program.provider.connection.getAccountInfo(rentVaultPDA);
    console.log(`rentVaultPDA: ${JSON.stringify(accountInfo)}`);
    assert(accountInfo.lamports === fundAmount.toNumber());
  });

  it('Create a new account using the Rent Vault', async () => {
    // Generate a new keypair for the new account
    const newAccount = new Keypair();
    console.log(`New Account: ${newAccount.publicKey}`);
    await program.methods
      .createNewAccount()
      .accounts({
        rentVault: rentVaultPDA,
        newAccount: newAccount.publicKey,
      })
      .signers([newAccount])
      .rpc();

    // Minimum balance for rent exemption for new account
    const lamports = await connection.getMinimumBalanceForRentExemption(0);

    // Check that the account was created
    const accountInfo = await connection.getAccountInfo(newAccount.publicKey);
    assert(accountInfo.lamports === lamports);
    const accountInfo2 = await program.provider.connection.getAccountInfo(rentVaultPDA);
    console.log(`rentVaultPDA: ${JSON.stringify(accountInfo2)}`);
  });
});
