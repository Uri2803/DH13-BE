# --- Stage 1: Build NestJS ---
FROM node:20-slim AS build

WORKDIR /app

# Copy file package
COPY package*.json ./

# Cài dependency
RUN npm ci

# Copy source
COPY . .

# Build NestJS -> ra thư mục dist
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

# Copy file package để cài deps runtime
COPY package*.json ./

# Cài deps (bỏ devDependencies)
RUN npm ci --omit=dev

# Copy code build từ stage build
COPY --from=build /app/dist ./dist

# Nếu có file cần lúc runtime (ví dụ: ormconfig.js/json) thì copy thêm:
# COPY ormconfig.js ./ormconfig.js

# NestJS mặc định chạy cổng 3000
EXPOSE 3000

# Dùng script start:prod trong package.json
CMD ["npm", "run", "start:prod"]
