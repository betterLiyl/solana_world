use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct TodoAccount<'info> {
    #[account(
        init, 
        payer = user, 
        space = Todo::INIT_SPACE + 8,
        seeds = [b"todo",user.key().as_ref()],
        bump
    )]
    pub todo_account: Account<'info, Todo>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK:
    pub system_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Debug, InitSpace)]
pub struct Todo {
    #[max_len(100)]
    pub title: String,
    pub completed: bool,
    pub user : Pubkey,
}
#[derive(Accounts)]
pub struct TodoAccountUpdate<'info> {
    #[account(mut,has_one = user)]
    pub todo_account: Account<'info, Todo>,
    pub user: Signer<'info>,
}
#[derive(Accounts)]
pub struct TodoAccountDelete<'info> {
    #[account(mut,has_one = user,close = user)]
    pub todo_account: Account<'info, Todo>,
    pub user: Signer<'info>,
    /// CHECK:
    pub system_program: AccountInfo<'info>,
}
