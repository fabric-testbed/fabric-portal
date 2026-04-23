# Multi-stage build for FABRIC Portal (Next.js standalone output)
# Node 22 LTS: Active LTS until Oct 2026, Maintenance until Apr 2028

# --- Build stage ---
FROM node:22-alpine AS builder
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# --- Runtime stage ---
# Uses Next.js standalone output (see next.config.js `output: 'standalone'`)
# Only the minimal server and static assets are copied from the build stage
FROM node:22-alpine AS runner
LABEL maintainer="Michael J. Stealey"
WORKDIR /code
ENV NODE_ENV=production
EXPOSE 3000
COPY --from=builder /code/public ./public
COPY --from=builder /code/.next/standalone ./
COPY --from=builder /code/.next/static ./.next/static
CMD ["node", "server.js"]
