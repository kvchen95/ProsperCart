# 后端构建阶段
FROM rust:1.78 as backend-builder
WORKDIR /app/backend
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs
RUN cargo build --release
COPY backend/src ./src
RUN cargo build --release

# 前端构建阶段
FROM node:18 as frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# 最终镜像
FROM debian:bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y postgresql-client
COPY --from=backend-builder /app/backend/target/release/backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend
COPY backend/.env.example ./backend/.env
COPY backend/migrations ./migrations

EXPOSE 3000
CMD ["./backend"]
