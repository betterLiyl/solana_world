use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use my_accounts::my_accounts::*;

use anchor_lang::solana_program::pubkey::Pubkey;
pub mod my_accounts;

declare_id!("3wm5mdxX5GxoF4VQMWtuacpdnZcWtqjH65fJfBUccVBP");

#[program]
pub mod crud {

    use super::*;

    pub fn create_todo_account(
        ctx: Context<TodoAccount>,
        title: String,
        completed: bool,
    ) -> ProgramResult {
        let todo = &mut ctx.accounts.todo_account;
        todo.title = title;
        todo.completed = completed;
        msg!("TODO created: {:?}", todo);
        Ok(())
    }

    pub fn update_todo_account(
        ctx: Context<TodoAccount>,
        title: String,
        completed: bool,
    ) -> ProgramResult {
        let todo = &mut ctx.accounts.todo_account;
        todo.title = title;
        todo.completed = completed;
        msg!("TODO updated: {:?}", todo);
        Ok(())
    }

    pub fn delete_todo_account(ctx: Context<TodoAccount>) -> ProgramResult {
        let todo = &mut ctx.accounts.todo_account;
        todo.title = String::new();
        todo.completed = false;
        msg!("TODO deleted");
        Ok(())
    }
}
