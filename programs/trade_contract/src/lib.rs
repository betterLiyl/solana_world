use anchor_lang::prelude::*;

use crate::trade_accounts::*;

pub mod error;
pub mod instructions;
pub mod trade_accounts;

declare_id!("c9MjPDoaAxrXXnzU9DA3BgYjcNfwEG3g7mTMUQX2fAb");

#[program]
pub mod trade_contract {
    use super::*;

    pub fn trade(ctx: Context<TransferAccount>, amount: u64) -> Result<()> {
        msg!("start: {:?}", ctx.program_id);
        instructions::trade::trade_mint(ctx, amount)?;
        Ok(())
    }
}

