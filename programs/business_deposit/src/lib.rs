use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;
declare_id!("GxaX7cV5J2aL9ejHZ9Lj49e6Smpa3LbYKADQAye3t6o4");

#[program]
pub mod business_deposit {

    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        token_uri: String,
    ) -> Result<()> {
        // let program_id = Pubkey::from_str("45jQhQUcCYWxa7LCosvoyxB6Qmwntf26Q14YVKCqSYRo").unwrap(); 
        // ctx.accounts.token_metadata_program = ;
        instructions::create_token(ctx, name, symbol, token_uri)?;
        Ok(())
    }

    pub fn mint(ctx: Context<MintToken>,amount:u64) -> Result<()> {
        instructions::mint_token(ctx,amount)?;
        Ok(())
    }

    pub fn transfer(ctx: Context<TransferAmount>,amount:u64) -> Result<()> {
        instructions::do_transfer(ctx,amount)?;
        Ok(())
    }
}
