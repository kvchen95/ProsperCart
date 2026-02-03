use crate::models::user::{User, Watchlist, WatchlistItem};
use sqlx::{PgPool, Result};

pub struct UserService {
    db: PgPool,
}

impl UserService {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn get_user_by_id(&self, user_id: i32) -> Result<Option<User>> {
        sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", user_id)
            .fetch_optional(&self.db)
            .await
    }

    pub async fn get_user_watchlist(&self, user_id: i32) -> Result<Vec<WatchlistItem>> {
        sqlx::query_as!(WatchlistItem, """
            SELECT s.symbol, s.name, s.price, s.change, s.change_percent
            FROM watchlist w
            JOIN stocks s ON w.stock_symbol = s.symbol
            WHERE w.user_id = $1
            ORDER BY s.symbol
        """, user_id)
            .fetch_all(&self.db)
            .await
    }

    pub async fn add_to_watchlist(&self, user_id: i32, stock_symbol: &str) -> Result<()> {
        sqlx::query!("""
            INSERT INTO watchlist (user_id, stock_symbol, added_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (user_id, stock_symbol) DO NOTHING
        """, user_id, stock_symbol)
            .execute(&self.db)
            .await
            .map(|_| ())
    }

    pub async fn remove_from_watchlist(&self, user_id: i32, stock_symbol: &str) -> Result<()> {
        sqlx::query!("""
            DELETE FROM watchlist
            WHERE user_id = $1 AND stock_symbol = $2
        """, user_id, stock_symbol)
            .execute(&self.db)
            .await
            .map(|_| ())
    }
}
