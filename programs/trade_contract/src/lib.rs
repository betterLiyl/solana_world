use anchor_lang::prelude::*;
#[warn(unused_imports)]
use crate::trade_accounts::*;

pub mod error;
pub mod instructions;
pub mod trade_accounts;

declare_id!("FG2t6RZk7GPPxqQ58sKS6JKT7rybauhFkvjnff8e2KMS");

#[program]
pub mod solana_world {
    use super::*;

    pub fn initialize(ctx: Context<TransferAccount>, amount: u64) -> Result<()> {
        msg!("start: {:?}", ctx.program_id);
        instructions::trade::trade_mint(ctx, amount)?;
        Ok(())
    }
}

