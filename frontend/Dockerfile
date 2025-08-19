# Stage 1: Build
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine

RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3300

# 👇 This line fixes 404 for React Router (SPA fallback)
CMD ["serve", "-s", "dist", "-l", "3300", "--single"]
