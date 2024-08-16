import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TradeContract } from "../target/types/trade_contract";
import { PublicKey, SystemProgram, Keypair,Connection } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";

describe("trade_contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  // let keypair = Keypair.fromSecretKey(new Uint8Array([25, 48, 112, 238, 175, 57, 67, 21, 45, 146, 167, 253, 48, 133, 223, 203, 107, 107, 223, 31, 20, 29, 124, 45, 116, 39, 124, 189, 201, 145, 20, 115, 9, 0, 199, 48, 232, 88, 161, 165, 226, 92, 103, 33, 70, 252, 252, 164, 14, 162, 171, 104, 33, 12, 109, 248, 181, 57, 254, 253, 141, 27, 101, 172]));
  let keypair = Keypair.fromSecretKey(new Uint8Array([226,136,206,73,29,163,0,21,50,226,22,124,183,155,47,216,191,116,95,225,129,104,164,171,67,203,60,6,86,144,91,145,88,198,213,171,237,87,76,160,234,254,201,55,170,148,125,247,156,97,39,122,32,156,125,46,135,27,124,132,18,235,241,42]));
  console.log(keypair.publicKey);
  // const connection = new Connection("http://127.0.0.1:8899");

  // const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(keypair), { commitment: 'confirmed' });
  

  const program = anchor.workspace.TradeContract as Program<TradeContract>;

  let mint: PublicKey;
  let fromTokenAccount: PublicKey;
  let toTokenAccount: PublicKey;
  let fromAuthority = provider.wallet.publicKey;
  // console.log("fromAuthority=", fromAuthority);
  // const getBalance =  provider.connection.getBalance(fromAuthority).then(console.log);
  // console.log("getBalance=", getBalance);
  it("Is initialized!", async () => {

    mint = await createMint(
      provider.connection,
      keypair,
      fromAuthority,
      null,
      9, // decimals
    );

    // try {
    //   fromTokenAccount = await createAccount(provider.connection, keypair, mint, fromAuthority);
    // } catch (e) {
    //   console.log(e);
    //   return
    // }
    // try {
    //   toTokenAccount = await createAccount(provider.connection, keypair, mint, fromAuthority);
    // } catch (e) {
    //   console.log(e);
    //   return
    // }
    console.log("fromAuthority=", fromAuthority.toBase58());
    console.log("mint=", mint.toBase58());
    // console.log("fromTokenAccount=", fromTokenAccount.toBase58());
    // console.log("toTokenAccount=", toTokenAccount.toBase58());

    // Mint tokens to the fromTokenAccount
    // try{
    // await mintTo(provider.connection, keypair, mint, fromTokenAccount, fromAuthority, 1000);
    // }catch(e){
    //   console.log(e);
    // }
    // try {

    //   await program.methods
    //     .trade(new anchor.BN(500))
    //     .accounts({
    //       from: fromTokenAccount,
    //       to: toTokenAccount,
    //       authority: fromAuthority,
    //       tokenProgram: TOKEN_2022_PROGRAM_ID
    //     })
    //     .rpc();
    // } catch (e) {
    //   console.log(e);
    // }
    // Check the balance
    // const fromAccountInfo = await provider.connection.getTokenAccountBalance(fromTokenAccount);
    // const toAccountInfo = await provider.connection.getTokenAccountBalance(toTokenAccount);

    // console.log("From Account Balance:", fromAccountInfo.value.amount);
    // console.log("To Account Balance:", toAccountInfo.value.amount);
  });
});
