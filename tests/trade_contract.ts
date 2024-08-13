import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaWorld } from "../target/types/solana_world";
const { Token, TOKEN_PROGRAM_ID } = require("@coral-xyz/anchor");

describe("trade_contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaWorld as Program<SolanaWorld>;

  it("Is initialized!", async () => {
    
    const fromAccount = provider.wallet.publicKey;
    const fromWallet = provider.wallet;
    const mint = await Token.createMint(
      provider.connection,
      fromWallet.publicKey,
      fromWallet.publicKey,
      null,
      9, // decimals
      TOKEN_PROGRAM_ID
    );
    const fromTokenAccount = await mint.createAccount(fromWallet.publicKey);
    const toTokenAccount = await mint.createAccount(anchor.web3.Keypair.generate().publicKey);
    // const toAccount = anchor.web3.Keypair.generate().publicKey;
    // Add your test here.
    await mint.mintTo(fromTokenAccount, fromWallet.publicKey, [], 1000000); // 铸造 1 个 Token (1 Token = 10^9 单位)

    const tx = await program.methods
      .initialize()
      .accounts({
        from: fromAccount,
        from_token_account: fromTokenAccount,
        to_token_account: toTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      
      .signers([])

      .rpc();


    console.log("Your transaction signature", tx);
  });
});
