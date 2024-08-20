import * as anchor from '@coral-xyz/anchor';
import type { Program } from '@coral-xyz/anchor';
import type { Hand } from '../target/types/hand';
import type { Lever } from '../target/types/lever';
import { program } from '@coral-xyz/anchor/dist/cjs/native/system';

describe('cpi', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const hand = anchor.workspace.Hand as Program<Hand>;
  const lever = anchor.workspace.Lever as Program<Lever>;

  // Generate a new keypair for the power account
  const powerAccount = new anchor.web3.Keypair();

  it('Initialize the lever!', async () => {
    await lever.methods
      .initialize()
      .accounts({
        power: powerAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([powerAccount])
      .rpc();
      let accountinfo = await lever.account.powerStatus.getAccountInfo(powerAccount.publicKey);
      
      console.log(powerAccount.publicKey)
      console.log(lever.programId)
      console.log(hand.programId)
      console.log("accountinfo = " + JSON.stringify(accountinfo));
  });

  it('Pull the lever!', async () => {
    await hand.methods
      .pullLever('Chris')
      .accounts({
        power: powerAccount.publicKey,
      })
      .rpc();
  });

  it('Pull it again!', async () => {
    await hand.methods
      .pullLever('Ashley')
      .accounts({
        power: powerAccount.publicKey,
      })
      .rpc();
  });
});
