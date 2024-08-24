import * as anchor from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import type { NftMinter } from '../target/types/nft_minter';

describe('NFT Minter', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.NftMinter as anchor.Program<NftMinter>;

  // The metadata for our NFT
  const metadata = {
    name: 'Homer NFT',
    symbol: 'HOMR',
    uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/nft.json',
  };
  console.log('programId=' + program.programId);
  it('Create an NFT!', async () => {
    // Generate a keypair to use as the address of our mint account
    const mintKeypair = new Keypair();
    console.log(1)
    // Derive the associated token address account for the mint and payer.
    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);
    console.log(2)
    let a = program.provider.connection.getAccountInfo(associatedTokenAccountAddress);
    console.log(JSON.stringify(a))

    //   // 创建关联的Token账户
    //   const associatedTokenAccountAddress2 = await PublicKey.findProgramAddress(
    //     [
    //         Buffer.from('associated_token_program'),
    //         payer.toBuffer(),
    //         new PublicKey('token_mint_address').toBuffer(),
    //     ],
    //     new PublicKey('associated_token_program_id')
    // );

    // // 构建交易
    // const transaction = new Transaction().add(
    //     SystemProgram.createAccountWithSeed({
    //         fromPubkey: payer,
    //         newAccountPubkey: mintKeypair.publicKey,
    //         basePubkey: payer,
    //         lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
    //         space: 82,
    //         programId: new PublicKey('token_program_id'),
    //     })
    // );

    let ss = program.account;
    console.log(ss);
    let ac = program.provider.connection.getAccountInfoAndContext(program.programId).then(()=>{});
    console.log("pID=" + program.programId)
    console.log("ac=" + JSON.stringify(ac))
    try {


      const transactionSignature = await program.methods
        .mintNft(metadata.name, metadata.symbol, metadata.uri)
        .accounts({
          payer: payer.publicKey,
          mintAccount: mintKeypair.publicKey,
          associatedTokenAccount: associatedTokenAccountAddress,
        })
        .signers([mintKeypair])
        .rpc({ skipPreflight: true });
      console.log('Success!');
      console.log(`   Mint Address: ${mintKeypair.publicKey}`);
      console.log(`   Transaction Signature: ${transactionSignature}`);
    } catch (err) {
      
      console.log(err);
    }
  });
});
