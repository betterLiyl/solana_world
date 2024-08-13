use anchor_lang::prelude::*;
use anchor_spl::token::Token;
/// pub struct TransferAccount<'info> {
///     pub from: Signer<'info>,
///     pub from_token_account: AccountInfo<'info>,
///     pub to_token_account: AccountInfo<'info>,
///     pub system_program: Program<'info, Token>,
/// }
#[derive(Accounts)]
pub struct TransferAccount<'info> {
    #[account(mut)]
    /// The account that is sending the tokens. It must be a valid SPL Token account
    /// and must have enough tokens to complete the transfer.
    pub from: Signer<'info>,
    #[account(mut)]
    ///CHECK:  The token account of the sender from which tokens will be withdrawn.
    /// This account must be initialized with the correct SPL Token mint and have sufficient tokens.
    pub from_token_account: AccountInfo<'info>,
    #[account(mut)]
    ///CHECK:  The token account of the recipient to which tokens will be deposited.
    /// This account must be initialized with the correct SPL Token mint.
    pub to_token_account: AccountInfo<'info>,
    /// The SPL Token program ID. This is used to perform the token transfer.
    pub system_program: Program<'info, Token>,
}
