FROM node:22-alpine AS builder

LABEL org.opencontainers.image.source=https://github.com/nkthanh/docker-ui
LABEL org.opencontainers.image.url=https://github.com/nkthanh/docker-ui
LABEL org.opencontainers.image.title="Docker UI"
LABEL org.opencontainers.image.description="Docker UI"
LABEL org.opencontainers.image.vendor="magiskboy"
LABEL org.opencontainers.image.authors="magiskboy"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.revision="1.0.0"

WORKDIR /opt/docker-ui

COPY ./package.json ./yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /opt/docker-ui

COPY --from=builder /opt/docker-ui/package.server.json /opt/docker-ui/package.json

RUN yarn install

COPY --from=builder /opt/docker-ui/build /opt/docker-ui/build
COPY --from=builder /opt/docker-ui/openapi /opt/docker-ui/openapi

USER 101

EXPOSE 3000

CMD ["yarn", "node", "./build/server.cjs"]

