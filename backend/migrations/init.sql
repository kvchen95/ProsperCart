-- 创建 stocks 表
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    change DECIMAL(10, 2) NOT NULL,
    change_percent DECIMAL(10, 2) NOT NULL,
    market_cap DECIMAL(20, 2),
    sector VARCHAR(100),
    last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建 watchlist 表
CREATE TABLE IF NOT EXISTS watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    stock_symbol VARCHAR(10) NOT NULL REFERENCES stocks(symbol),
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, stock_symbol)
);

-- 插入示例数据
INSERT INTO users (username, email) VALUES ('demo', 'demo@example.com') ON CONFLICT DO NOTHING;

INSERT INTO stocks (symbol, name, price, change, change_percent, market_cap, sector) VALUES
('AAPL', 'Apple Inc.', 187.56, 1.23, 0.66, 2920000000000, 'Technology'),
('MSFT', 'Microsoft Corporation', 412.34, -2.15, -0.52, 3100000000000, 'Technology'),
('GOOGL', 'Alphabet Inc.', 137.45, 0.87, 0.64, 1800000000000, 'Technology'),
('AMZN', 'Amazon.com Inc.', 178.92, 1.56, 0.88, 1830000000000, 'Consumer Cyclical'),
('TSLA', 'Tesla, Inc.', 213.45, -3.21, -1.48, 668000000000, 'Consumer Cyclical')
ON CONFLICT (symbol) DO NOTHING;

-- 插入示例自选股数据
INSERT INTO watchlist (user_id, stock_symbol) VALUES (1, 'AAPL'), (1, 'MSFT') ON CONFLICT DO NOTHING;
