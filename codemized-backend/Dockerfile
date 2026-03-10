# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — NestJS Backend (multi-stage)
#
# Stages:
#   1. builder     → install all deps + compile TypeScript to dist/
#   2. production  → install only prod deps + copy compiled output
#
# Result: lean production image without devDependencies or source files
# ─────────────────────────────────────────────────────────────────────────────

# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally (not bundled in node:alpine)
RUN npm install -g pnpm

# Copy lockfile + manifest first to leverage Docker layer caching
# If package files haven't changed, this layer is reused on rebuilds
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source after deps to maximize cache hits
COPY . .

# Compile TypeScript → dist/
RUN pnpm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm to run the prod install
RUN npm install -g pnpm

# Copy only the manifests needed for prod install
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only (no devDependencies)
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port NestJS listens on
EXPOSE 3001

# Start the compiled app directly with Node (no ts-node overhead)
CMD ["node", "dist/main"]
