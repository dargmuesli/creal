#############
# Serve Nuxt in development mode.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:18.12.1-slim@sha256:3139aa3e8915e7c135623498d29f20a75ee3bfc41cf321ceaa59470b2fffc1a5 AS development

COPY ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

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
FROM node:18.12.1-slim@sha256:3139aa3e8915e7c135623498d29f20a75ee3bfc41cf321ceaa59470b2fffc1a5 AS prepare

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
FROM node:18.12.1-slim@sha256:3139aa3e8915e7c135623498d29f20a75ee3bfc41cf321ceaa59470b2fffc1a5 AS build

ARG CI=false
ENV CI ${CI}
ARG NUXT_ENV_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_ENV_STACK_DOMAIN=${NUXT_ENV_STACK_DOMAIN}

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run build

ENV NODE_ENV=production
# Discard devDependencies.
RUN pnpm install


########################
# Nuxt: lint

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.12.1-slim@sha256:3139aa3e8915e7c135623498d29f20a75ee3bfc41cf321ceaa59470b2fffc1a5 AS lint

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run lint


#######################
# Collect build, lint and test results.

# Should be the specific version of `node:slim`.
FROM node:18.12.1-slim@sha256:3139aa3e8915e7c135623498d29f20a75ee3bfc41cf321ceaa59470b2fffc1a5 AS collect

WORKDIR /srv/app/

COPY --from=build /srv/app/.output ./.output
COPY --from=lint /srv/app/package.json /tmp/lint/package.json
# COPY --from=test-unit /srv/app/package.json /tmp/test/package.json
# COPY --from=test-integration /srv/app/package.json /tmp/test/package.json


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:18.12.1-slim@sha256:3139aa3e8915e7c135623498d29f20a75ee3bfc41cf321ceaa59470b2fffc1a5 AS production

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

COPY --from=collect /srv/app/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
