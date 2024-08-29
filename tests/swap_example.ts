import * as anchor from '@coral-xyz/anchor';
import type { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';
import { PublicKey } from '@solana/web3.js';
import type { SwapExample } from '../target/types/swap_example';
import { type TestValues, createValues, expectRevert, mintingTokens } from './utils';

describe('Create AMM', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.SwapExample as Program<SwapExample>;

  let values: TestValues;

  beforeEach(() => {
    values = createValues();
  });

  it('Creation', async () => {
    await program.methods.createAmm(values.id, values.fee).accounts({ amm: values.ammKey, admin: values.admin.publicKey }).rpc();

    const ammAccount = await program.account.amm.fetch(values.ammKey);
    expect(ammAccount.id.toString()).to.equal(values.id.toString());
    expect(ammAccount.admin.toString()).to.equal(values.admin.publicKey.toString());
    expect(ammAccount.fee.toString()).to.equal(values.fee.toString());
  });

  it('Invalid fee', async () => {
    values.fee = 10000;

    await expectRevert(program.methods.createAmm(values.id, values.fee).accounts({ amm: values.ammKey, admin: values.admin.publicKey }).rpc());
  });
});

describe('Create pool', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.SwapExample as Program<SwapExample>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues();

    await program.methods.createAmm(values.id, values.fee).accounts({ amm: values.ammKey, admin: values.admin.publicKey }).rpc();

    await mintingTokens({
      connection,
      creator: values.admin,
      mintAKeypair: values.mintAKeypair,
      mintBKeypair: values.mintBKeypair,
    });
  });

  it('Creation', async () => {
    await program.methods
      .createPool()
      .accounts({
        amm: values.ammKey,
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
      })
      .rpc({ skipPreflight: true });
  });

  it('Invalid mints', async () => {
    values = createValues({
      mintBKeypair: values.mintAKeypair,
      poolKey: PublicKey.findProgramAddressSync(
        [values.id.toBuffer(), values.mintAKeypair.publicKey.toBuffer(), values.mintBKeypair.publicKey.toBuffer()],
        program.programId,
      )[0],
      poolAuthority: PublicKey.findProgramAddressSync(
        [values.id.toBuffer(), values.mintAKeypair.publicKey.toBuffer(), values.mintBKeypair.publicKey.toBuffer(), Buffer.from('authority')],
        program.programId,
      )[0],
    });

    await expectRevert(
      program.methods
        .createPool()
        .accounts({
          amm: values.ammKey,
          pool: values.poolKey,
          poolAuthority: values.poolAuthority,
          mintLiquidity: values.mintLiquidity,
          mintA: values.mintAKeypair.publicKey,
          mintB: values.mintBKeypair.publicKey,
          poolAccountA: values.poolAccountA,
          poolAccountB: values.poolAccountB,
        })
        .rpc(),
    );
  });
});

describe('Deposit liquidity', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.SwapExample as Program<SwapExample>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues();

    await program.methods.createAmm(values.id, values.fee).accounts({ amm: values.ammKey, admin: values.admin.publicKey }).rpc();

    await mintingTokens({
      connection,
      creator: values.admin,
      mintAKeypair: values.mintAKeypair,
      mintBKeypair: values.mintBKeypair,
    });

    await program.methods
      .createPool()
      .accounts({
        amm: values.ammKey,
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
      })
      .rpc();
  });

  it('Deposit equal amounts', async () => {
    await program.methods
      .depositLiquidity(values.depositAmountA, values.depositAmountA)
      .accounts({
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
        depositorAccountLiquidity: values.liquidityAccount,
        depositorAccountA: values.holderAccountA,
        depositorAccountB: values.holderAccountB,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });

    const depositTokenAccountLiquditiy = await connection.getTokenAccountBalance(values.liquidityAccount);
    expect(depositTokenAccountLiquditiy.value.amount).to.equal(values.depositAmountA.sub(values.minimumLiquidity).toString());
    const depositTokenAccountA = await connection.getTokenAccountBalance(values.holderAccountA);
    expect(depositTokenAccountA.value.amount).to.equal(values.defaultSupply.sub(values.depositAmountA).toString());
    const depositTokenAccountB = await connection.getTokenAccountBalance(values.holderAccountB);
    expect(depositTokenAccountB.value.amount).to.equal(values.defaultSupply.sub(values.depositAmountA).toString());
  });
});


describe('Withdraw liquidity', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.SwapExample as Program<SwapExample>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues();

    await program.methods.createAmm(values.id, values.fee).accounts({ amm: values.ammKey, admin: values.admin.publicKey }).rpc();

    await mintingTokens({
      connection,
      creator: values.admin,
      mintAKeypair: values.mintAKeypair,
      mintBKeypair: values.mintBKeypair,
    });

    await program.methods
      .createPool()
      .accounts({
        amm: values.ammKey,
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
      })
      .rpc();

    await program.methods
      .depositLiquidity(values.depositAmountA, values.depositAmountA)
      .accounts({
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
        depositorAccountLiquidity: values.liquidityAccount,
        depositorAccountA: values.holderAccountA,
        depositorAccountB: values.holderAccountB,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });
  });

  it('Withdraw everything', async () => {
    await program.methods
      .withdrawLiquidity(values.depositAmountA.sub(values.minimumLiquidity))
      .accounts({
        amm: values.ammKey,
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
        depositorAccountLiquidity: values.liquidityAccount,
        depositorAccountA: values.holderAccountA,
        depositorAccountB: values.holderAccountB,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });

    const liquidityTokenAccount = await connection.getTokenAccountBalance(values.liquidityAccount);
    const depositTokenAccountA = await connection.getTokenAccountBalance(values.holderAccountA);
    const depositTokenAccountB = await connection.getTokenAccountBalance(values.holderAccountB);
    expect(liquidityTokenAccount.value.amount).to.equal('0');
    expect(Number(depositTokenAccountA.value.amount)).to.be.lessThan(values.defaultSupply.toNumber());
    expect(Number(depositTokenAccountA.value.amount)).to.be.greaterThan(values.defaultSupply.sub(values.depositAmountA).toNumber());
    expect(Number(depositTokenAccountB.value.amount)).to.be.lessThan(values.defaultSupply.toNumber());
    expect(Number(depositTokenAccountB.value.amount)).to.be.greaterThan(values.defaultSupply.sub(values.depositAmountA).toNumber());
  });
});

describe('Swap', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.SwapExample as Program<SwapExample>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues();

    await program.methods.createAmm(values.id, values.fee).accounts({ amm: values.ammKey, admin: values.admin.publicKey }).rpc();

    await mintingTokens({
      connection,
      creator: values.admin,
      mintAKeypair: values.mintAKeypair,
      mintBKeypair: values.mintBKeypair,
    });

    await program.methods
      .createPool()
      .accounts({
        amm: values.ammKey,
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
      })
      .rpc();

    await program.methods
      .depositLiquidity(values.depositAmountA, values.depositAmountB)
      .accounts({
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        depositor: values.admin.publicKey,
        mintLiquidity: values.mintLiquidity,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
        depositorAccountLiquidity: values.liquidityAccount,
        depositorAccountA: values.holderAccountA,
        depositorAccountB: values.holderAccountB,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });
  });

  it('Swap from A to B', async () => {
    const input = new BN(10 ** 6);
    await program.methods
      .swapExactTokensForTokens(true, input, new BN(100))
      .accounts({
        amm: values.ammKey,
        pool: values.poolKey,
        poolAuthority: values.poolAuthority,
        trader: values.admin.publicKey,
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
        traderAccountA: values.holderAccountA,
        traderAccountB: values.holderAccountB,
      })
      .signers([values.admin])
      .rpc({ skipPreflight: true });

    const traderTokenAccountA = await connection.getTokenAccountBalance(values.holderAccountA);
    const traderTokenAccountB = await connection.getTokenAccountBalance(values.holderAccountB);
    expect(traderTokenAccountA.value.amount).to.equal(values.defaultSupply.sub(values.depositAmountA).sub(input).toString());
    expect(Number(traderTokenAccountB.value.amount)).to.be.greaterThan(values.defaultSupply.sub(values.depositAmountB).toNumber());
    expect(Number(traderTokenAccountB.value.amount)).to.be.lessThan(values.defaultSupply.sub(values.depositAmountB).add(input).toNumber());
  });
});