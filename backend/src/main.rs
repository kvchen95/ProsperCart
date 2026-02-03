use axum::{routing::get, Router, Json};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[derive(Debug, Serialize)]
struct Stock {
    symbol: String,
    name: String,
    price: f64,
    change: f64,
    change_percent: f64,
}

#[derive(Debug, Serialize)]
struct StockAnalysis {
    symbol: String,
    analysis: String,
    fundamentals: Fundamentals,
    sentiment: String,
}

#[derive(Debug, Serialize)]
struct Fundamentals {
    pe_ratio: f64,
    eps: f64,
    revenue_growth: f64,
    profit_margin: f64,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/api/stocks", get(get_stocks))
        .route("/api/stocks/:symbol", get(get_stock_detail))
        .route("/api/stocks/:symbol/analysis", get(get_stock_analysis))
        .route("/api/user/watchlist", get(get_watchlist));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn get_stocks() -> Json<Vec<Stock>> {
    let stocks = vec![
        Stock {
            symbol: "AAPL".to_string(),
            name: "Apple Inc.".to_string(),
            price: 187.56,
            change: 1.23,
            change_percent: 0.66,
        },
        Stock {
            symbol: "MSFT".to_string(),
            name: "Microsoft Corporation".to_string(),
            price: 412.34,
            change: -2.15,
            change_percent: -0.52,
        },
        Stock {
            symbol: "GOOGL".to_string(),
            name: "Alphabet Inc.".to_string(),
            price: 137.45,
            change: 0.87,
            change_percent: 0.64,
        },
    ];
    Json(stocks)
}

async fn get_stock_detail(axum::extract::Path(symbol): axum::extract::Path<String>) -> Json<Stock> {
    let stock = Stock {
        symbol: symbol.clone(),
        name: format!("Stock {}", symbol),
        price: 100.0,
        change: 1.0,
        change_percent: 1.0,
    };
    Json(stock)
}

async fn get_stock_analysis(axum::extract::Path(symbol): axum::extract::Path<String>) -> Json<StockAnalysis> {
    let analysis = StockAnalysis {
        symbol: symbol.clone(),
        analysis: format!("This is a detailed analysis of {}.", symbol),
        fundamentals: Fundamentals {
            pe_ratio: 25.5,
            eps: 4.2,
            revenue_growth: 15.2,
            profit_margin: 12.8,
        },
        sentiment: "positive".to_string(),
    };
    Json(analysis)
}

async fn get_watchlist() -> Json<Vec<Stock>> {
    let watchlist = vec![
        Stock {
            symbol: "AAPL".to_string(),
            name: "Apple Inc.".to_string(),
            price: 187.56,
            change: 1.23,
            change_percent: 0.66,
        },
        Stock {
            symbol: "MSFT".to_string(),
            name: "Microsoft Corporation".to_string(),
            price: 412.34,
            change: -2.15,
            change_percent: -0.52,
        },
    ];
    Json(watchlist)
}
