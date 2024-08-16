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
    ///CHECK: The account that is sending the tokens. It must be a valid SPL Token account
    /// and must have enough tokens to complete the transfer.
    /// 
    /// Account<'info, MyDataStructure>,
    /// 这种用于处理自定义的账户数据结构或SPL Token账户。
    /// 
    ///  AccountInfo<'info>,
    /// 用于处理不带有特定数据结构的账户。
    /// 这个类型非常灵活，可以用来操作任何账户，
    /// 适用于对账户元数据（如余额、所有者等）的操作。
    pub from: AccountInfo<'info>,
    #[account(mut)]
    ///CHECK:  The token account of the sender from which tokens will be withdrawn.
    /// This account must be initialized with the correct SPL Token mint and have sufficient tokens.
    pub to: AccountInfo<'info>,
    ///CHECK:  The token account of the recipient to which tokens will be deposited.
    /// This account must be initialized with the correct SPL Token mint.
    pub authority: Signer<'info>,
    ///CHECK: The SPL Token program ID. This is used to perform the token transfer.
    pub token_program: Program<'info, Token>,
}
