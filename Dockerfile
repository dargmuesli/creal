#############
# Serve Nuxt in development mode.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:18.12.1-slim@sha256:4f2bfa18008f5b8c201df4bfc847b50ed5306bd0ff52343b2c82c568a677575c AS development

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

COPY ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

WORKDIR /srv/app/

VOLUME /srv/.pnpm-store
VOLUME /srv/app
VOLUME /srv/sqitch

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "dev"]

# Waiting for https://github.com/nuxt/framework/issues/6915
# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

# Should be the specific version of `node:slim`.
FROM node:18.12.1-slim@sha256:4f2bfa18008f5b8c201df4bfc847b50ed5306bd0ff52343b2c82c568a677575c AS prepare

WORKDIR /srv/app/

COPY ./nuxt/pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm fetch

COPY ./nuxt/ ./

RUN pnpm install --offline \
  && pnpm nuxi prepare
# TODO: replace nuxi with nuxt


########################
# Build Nuxt.

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.12.1-slim@sha256:4f2bfa18008f5b8c201df4bfc847b50ed5306bd0ff52343b2c82c568a677575c AS build

ARG CI=false
ENV CI ${CI}
ARG NUXT_ENV_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_ENV_STACK_DOMAIN=${NUXT_ENV_STACK_DOMAIN}

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

ENV NODE_ENV=production
RUN npm install -g pnpm && \
    pnpm run build


########################
# Nuxt: lint

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.12.1-slim@sha256:4f2bfa18008f5b8c201df4bfc847b50ed5306bd0ff52343b2c82c568a677575c AS lint

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run lint


########################
# Nuxt: test (integration)

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.0.0@sha256:a1756160eeb70fb979462f79d2239ea28bbea6a58b8a0e88ac898e38c3d4e114 AS test-integration_base

ARG UNAME=cypress
ARG UID=1000
ARG GID=1000

ENV DOCKER=true

WORKDIR /srv/app/

# Update and install dependencies.
RUN apt-get update \
    # pnpm
    && npm install -g pnpm \
    # user
    && groupadd -g $GID -o $UNAME \
    && useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME \
    # clean
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER $UNAME

VOLUME /srv/app


########################
# Nuxt: test (integration)

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.0.0@sha256:a1756160eeb70fb979462f79d2239ea28bbea6a58b8a0e88ac898e38c3d4e114 AS test-integration

# Update and install dependencies.
RUN npm install -g pnpm

WORKDIR /srv/app/

COPY --from=prepare /root/.cache/Cypress /root/.cache/Cypress
COPY --from=build /srv/app/ ./

RUN pnpm test:integration:prod \
    && pnpm test:integration:dev


#######################
# Collect build, lint and test results.

# Should be the specific version of `node:slim`.
FROM node:18.12.1-slim@sha256:4f2bfa18008f5b8c201df4bfc847b50ed5306bd0ff52343b2c82c568a677575c AS collect

WORKDIR /srv/app/

COPY --from=build /srv/app/.output ./.output
COPY --from=lint /srv/app/package.json /tmp/lint/package.json
# COPY --from=test-unit /srv/app/package.json /tmp/test/package.json
COPY --from=test-integration /srv/app/package.json /tmp/test/package.json


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:18.12.1-slim@sha256:4f2bfa18008f5b8c201df4bfc847b50ed5306bd0ff52343b2c82c568a677575c AS production

ENV NODE_ENV=production

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
# - `wget` is required by the healthcheck
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY ./sqitch/ /srv/sqitch/
COPY ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

COPY --from=collect /srv/app/ ./

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
