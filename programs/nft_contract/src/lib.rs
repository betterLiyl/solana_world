use anchor_lang::prelude::*;

declare_id!("FG2t6RZk7GPPxqQ58sKS6JKT7rybauhFkvjnff8e2KMS");

#[program]
pub mod solana_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
