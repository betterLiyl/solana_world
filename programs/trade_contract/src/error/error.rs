use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance to perform the transfer.")]
    InsufficientBalance,
    #[msg("Invalid Type")]
    InvalidType,
}