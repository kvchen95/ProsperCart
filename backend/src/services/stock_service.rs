use crate::models::stock::{Stock, StockPriceUpdate};
use sqlx::{PgPool, Result};

pub struct StockService {
    db: PgPool,
}

impl StockService {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn get_all_stocks(&self) -> Result<Vec<Stock>> {
        sqlx::query_as!(Stock, "SELECT * FROM stocks ORDER BY symbol")
            .fetch_all(&self.db)
            .await
    }

    pub async fn get_stock_by_symbol(&self, symbol: &str) -> Result<Option<Stock>> {
        sqlx::query_as!(Stock, "SELECT * FROM stocks WHERE symbol = $1", symbol)
            .fetch_optional(&self.db)
            .await
    }

    pub async fn update_stock_price(&self, symbol: &str, update: &StockPriceUpdate) -> Result<()> {
        sqlx::query!("""
            UPDATE stocks
            SET price = $1, change = $2, change_percent = $3, last_updated = NOW()
            WHERE symbol = $4
        """, update.price, update.change, update.change_percent, symbol)
            .execute(&self.db)
            .await
            .map(|_| ())
    }

    pub async fn create_stock(&self, symbol: &str, name: &str) -> Result<Stock> {
        sqlx::query_as!(Stock, """
            INSERT INTO stocks (symbol, name, price, change, change_percent, last_updated)
            VALUES ($1, $2, 0.0, 0.0, 0.0, NOW())
            RETURNING *
        """, symbol, name)
            .fetch_one(&self.db)
            .await
    }
}
