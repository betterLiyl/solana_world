import * as anchor from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PublicKey, Keypair } from '@solana/web3.js';
import type { BusinessDeposit } from '../target/types/business_deposit';

describe('business_deposit', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const payer = provider.wallet as anchor.Wallet;
    const program = anchor.workspace.BusinessDeposit as anchor.Program<BusinessDeposit>;

    const metadata = {
        name: 'Goat',
        symbol: 'Goat',
        uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
    };
    // Generate new keypair to use as address for mint account.
    const mintKeypair = new Keypair();
    console.log(`mintKeypair: ${mintKeypair.publicKey}`);
    console.log(`mintKeypair: ${mintKeypair.secretKey}`);
    // Generate new keypair to use as address for recipient wallet.
    const recipient = new Keypair();
    console.log(`recipient: ${recipient.secretKey}`);
    // Derive the associated token address account for the mint and payer.
    const senderTokenAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);
    console.log(`senderTokenAddress: ${senderTokenAddress}`);
    // Derive the associated token address account for the mint and recipient.
    const recepientTokenAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, recipient.publicKey);
    console.log(`recepientTokenAddress: ${recepientTokenAddress}`);
    it('Create an spl token!', async () => {
        try {


            const transactionSignature = await program.methods
                .createToken(metadata.name, metadata.symbol, metadata.uri)
                .accounts({
                    payer: payer.publicKey,
                    mintAccount: mintKeypair.publicKey,
                })
                // .signers([minptKeypair])
                .rpc();
                console.log('Success!');
                console.log(`   Mint Address: ${mintKeypair.publicKey}`);
                console.log(`   Transaction Signature: ${transactionSignature}`);
        } catch (error) {
            console.log(error);
        }

    });
    // it('Mint tokens!', async () => {
    //     // Amount of tokens to mint.
    //     const amount = new anchor.BN(100);
    //     console.log('amount=' + amount);
    //     // Mint the tokens to the associated token account.
    //     const transactionSignature = await program.methods
    //         .mint(amount)
    //         .accounts({
    //             mintAuthority: payer.publicKey,
    //             recipient: payer.publicKey,
    //             mintAccount: mintKeypair.publicKey,
    //             associatedTokenAccount: senderTokenAddress,
    //         })
    //         .rpc();

    //     console.log('Success!');
    //     console.log(`   Associated Token Account Address: ${senderTokenAddress}`);
    //     console.log(`   Transaction Signature: ${transactionSignature}`);
    // });
    // it('Transfer tokens!', async () => {
    //     // Amount of tokens to transfer.
    //     const amount = new anchor.BN(50);

    //     const transactionSignature = await program.methods
    //         .transfer(amount)
    //         .accounts({
    //             sender: payer.publicKey,
    //             recipient: recipient.publicKey,
    //             mintAccount: mintKeypair.publicKey,
    //             senderTokenAccount: senderTokenAddress,
    //             recipientTokenAccount: recepientTokenAddress,
    //         })
    //         .rpc();

    //     console.log('Success!');
    //     console.log(`   Transaction Signature: ${transactionSignature}`);
    // });

});