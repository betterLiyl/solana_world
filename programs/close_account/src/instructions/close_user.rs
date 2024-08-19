use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CloseUserContext<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"USER",
            user.key().as_ref(),
        ],
        bump = user_account.bump,
        close = user, // close account and return lamports to user
    )]
    pub user_account: Account<'info, UserState>,
}

pub fn close_user(_ctx: Context<CloseUserContext>) -> Result<()> {
    //关闭用户之后，lamports会返回给用户（创建用户时的payer），交易会支付fee，fee的一半会燃烧
    Ok(())
}
