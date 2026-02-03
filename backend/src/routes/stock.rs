use axum::{extract::Path, http::StatusCode, routing::get, Router, Json};
use serde_json::Value;

use crate::{services::{stock_service::StockService, ai_service::AIService}, config::database::establish_connection};

pub fn router() -> Router {
    Router::new()
        .route("/api/stocks", get(get_stocks))
        .route("/api/stocks/:symbol", get(get_stock_detail))
        .route("/api/stocks/:symbol/analysis", get(get_stock_analysis))
}

async fn get_stocks() -> Result<Json<Value>, StatusCode> {
    let db = establish_connection().await;
    let stock_service = StockService::new(db);

    match stock_service.get_all_stocks().await {
        Ok(stocks) => Ok(Json(serde_json::to_value(stocks).unwrap())),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_stock_detail(Path(symbol): Path<String>) -> Result<Json<Value>, StatusCode> {
    let db = establish_connection().await;
    let stock_service = StockService::new(db);

    match stock_service.get_stock_by_symbol(&symbol).await {
        Ok(Some(stock)) => Ok(Json(serde_json::to_value(stock).unwrap())),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn get_stock_analysis(Path(symbol): Path<String>) -> Result<Json<Value>, StatusCode> {
    let db = establish_connection().await;
    let stock_service = StockService::new(db);
    let ai_service = AIService::new();

    match stock_service.get_stock_by_symbol(&symbol).await {
        Ok(Some(stock)) => {
            let analysis = ai_service.analyze_stock(&stock);
            let analysis_json = serde_json::json!({
                "symbol": analysis.symbol,
                "analysis": analysis.analysis,
                "fundamentals": {
                    "pe_ratio": analysis.fundamentals.pe_ratio,
                    "eps": analysis.fundamentals.eps,
                    "revenue_growth": analysis.fundamentals.revenue_growth,
                    "profit_margin": analysis.fundamentals.profit_margin
                },
                "sentiment": analysis.sentiment
            });
            Ok(Json(analysis_json))
        }
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
