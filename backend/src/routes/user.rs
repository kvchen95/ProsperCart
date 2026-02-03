use axum::{extract::Query, http::StatusCode, routing::get, Router, Json};
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::{services::user_service::UserService, config::database::establish_connection};

#[derive(Debug, Deserialize)]
struct WatchlistParams {
    user_id: i32,
    symbol: Option<String>,
}

pub fn router() -> Router {
    Router::new()
        .route("/api/user/watchlist", get(get_watchlist))
        .route("/api/user/watchlist/add", get(add_to_watchlist))
        .route("/api/user/watchlist/remove", get(remove_from_watchlist))
}

async fn get_watchlist(Query(params): Query<WatchlistParams>) -> Result<Json<Value>, StatusCode> {
    let db = establish_connection().await;
    let user_service = UserService::new(db);

    match user_service.get_user_watchlist(params.user_id).await {
        Ok(watchlist) => Ok(Json(serde_json::to_value(watchlist).unwrap())),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn add_to_watchlist(Query(params): Query<WatchlistParams>) -> Result<Json<Value>, StatusCode> {
    let db = establish_connection().await;
    let user_service = UserService::new(db);

    if let Some(symbol) = params.symbol {
        match user_service.add_to_watchlist(params.user_id, &symbol).await {
            Ok(_) => Ok(Json(serde_json::json!({
                "success": true,
                "message": format!("Added {} to watchlist", symbol)
            }))),
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
        }
    } else {
        Err(StatusCode::BAD_REQUEST)
    }
}

async fn remove_from_watchlist(Query(params): Query<WatchlistParams>) -> Result<Json<Value>, StatusCode> {
    let db = establish_connection().await;
    let user_service = UserService::new(db);

    if let Some(symbol) = params.symbol {
        match user_service.remove_from_watchlist(params.user_id, &symbol).await {
            Ok(_) => Ok(Json(serde_json::json!({
                "success": true,
                "message": format!("Removed {} from watchlist", symbol)
            }))),
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
        }
    } else {
        Err(StatusCode::BAD_REQUEST)
    }
}
