# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../.. .
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
RUN pnpm install --frozen-lockfile
WORKDIR /app/packages/db
RUN pnpm prisma generate
WORKDIR /app/packages/api
RUN pnpm build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/packages/api/dist ./dist
COPY --from=build /app/packages/api/package.json .
COPY --from=build /app/packages/api/node_modules ./node_modules
COPY --from=build /app/uploads ./uploads
EXPOSE 3000
CMD ["node", "dist/index.js"]
