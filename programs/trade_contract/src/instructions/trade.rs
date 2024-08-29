use crate::trade_accounts::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer as TokenTransfer};
// pub fn trade_sol(ctx: Context<TransferAccount>, amount: u64) -> Result<()> {
//     msg!("Trade sol beginning");

//     let from_balance = &ctx.accounts.from.to_account_info().lamports();

//     if *from_balance < amount {
//         return Err(error!(InsufficientBalance));
//     }

//     let account_len = ctx.accounts.from.to_account_info().data_len();
//     let minimum_rent = Rent::get()?.minimum_balance(account_len);
//     if (*from_balance - amount) < minimum_rent {
//         return Err(error!(InsufficientBalance));
//     }

//     let ix = anchor_lang::solana_program::system_instruction::transfer(
//         &ctx.accounts.from.key(),
//         &ctx.accounts.to_token_account.key(),
//         amount,
//     );

//     anchor_lang::solana_program::program::invoke(
//         &ix,
//         &[
//             ctx.accounts.from.to_account_info(),
//             ctx.accounts.to_token_account.to_account_info(),
//         ],
//     )?;

//     Ok(())
// }

pub fn trade_mint(ctx: Context<TransferAccount>, amount: u64) -> Result<()> {
    

    // if ctx.accounts.from_token_account. < amount{
    //     return Err(error!(InsufficientBalance));
    // }
    let cpi_account = TokenTransfer{
        from: ctx.accounts.from.to_account_info(),
        to: ctx.accounts.to.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    let cpi_progam = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_progam, cpi_account);
    token::transfer(cpi_ctx, amount)?;
    Ok(())
}
