import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Crud } from "../target/types/crud";
const title = "Learn Solana";
const completed = false;

describe("crud", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  let user = provider.wallet.publicKey;
  const program = anchor.workspace.Crud as Program<Crud>;


  let [todoAccountPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("todo"), user.toBuffer()],
    program.programId
  );
  let programId = anchor.web3.SystemProgram.programId

  console.log("programId="+programId)
  console.log("todoAccountPda="+todoAccountPda)
//   it("Is crud-create!", async () => {
//     // Add your test here.
//     await  program.methods
//       .createTodoAccount(title,completed)
//       .accounts({
//         todoAccount:todoAccountPda,
//         user: user,
//         systemProgram: programId,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//       })
//       .signers([provider.wallet.payer])
//       .rpc();
//       let fetch = program.account.todo.fetch(todoAccountPda).then(console.log);
//       console.log("created data=", fetch );
//   });

//   it("Is crud-update!", async () => {

//     const title2 = "Updated TODO";
//     const completed2 = true;
//     try{
//         await  program.methods
//         .updateTodoAccount(title2,completed2)
//         .accounts({
//           todoAccount:todoAccountPda,
//           user: user,
//          systemProgram: programId,
         
//         })
//         .signers([provider.wallet.payer])
//         .rpc();
//         let fetch = program.account.todo.fetch(todoAccountPda).then(console.log);
//         console.log("updated data=", fetch );
//     }catch(e){
//         console.log("error=", e);
//     }
    
//   });

  it("Deletes the TODO account", async () => {
    await program.methods
      .deleteTodoAccount()
      .accounts({
        todoAccount: todoAccountPda,
        user: user,
        systemProgram: programId,
      })
      .signers([provider.wallet.payer]) // Add the signer here
      .rpc();

    const fetch = await program.account.todo.fetch(todoAccountPda).then(console.log);
    console.log("Deletes data=", fetch );
  });
});
