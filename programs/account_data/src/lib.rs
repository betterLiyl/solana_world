#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;
pub mod state;

declare_id!("DMYPyp3Gqt9UQJiSHytfBUezXpnN1HqzCVTm3Uii76Y9");

#[program]
pub mod anchor_program_example {
    use super::*;

    pub fn create_address_info(
        ctx: Context<CreateAddressInfo>,
        name: String,
        house_number: u8,
        street: String,
        city: String,
    ) -> Result<()> {
        create::create_address_info(ctx, name, house_number, street, city)
    }
}
