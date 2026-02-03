use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Stock {
    pub id: i32,
    pub symbol: String,
    pub name: String,
    pub price: f64,
    pub change: f64,
    pub change_percent: f64,
    pub market_cap: Option<f64>,
    pub sector: Option<String>,
    pub last_updated: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StockCreate {
    pub symbol: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StockPriceUpdate {
    pub price: f64,
    pub change: f64,
    pub change_percent: f64,
}
