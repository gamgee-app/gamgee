FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV GAMGEE_CONFIG=/data/config.yaml
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/
RUN npm ci --omit=dev --workspace=@gamgee/server --include-workspace-root
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/web/dist ./packages/web/dist
VOLUME ["/data"]
EXPOSE 8787
CMD ["node", "packages/server/dist/index.js"]
