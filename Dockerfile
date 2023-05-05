#############
# Serve Nuxt in development mode.

FROM node:20.1.0-slim@sha256:80c3e9753fed11eee3021b96497ba95fe15e5a1dfc16aaf5bc66025f369e00dd AS development

COPY ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable

WORKDIR /srv/app/

VOLUME /srv/.pnpm-store
VOLUME /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "--dir", "nuxt", "dev"]

# Waiting for https://github.com/nuxt/framework/issues/6915
# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

FROM node:20.1.0-slim@sha256:80c3e9753fed11eee3021b96497ba95fe15e5a1dfc16aaf5bc66025f369e00dd AS prepare

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

COPY ./pnpm-lock.yaml ./

RUN corepack enable && \
    pnpm fetch

COPY ./ ./

RUN pnpm install --offline


########################
# Build Nuxt.

# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:20.1.0-slim@sha256:80c3e9753fed11eee3021b96497ba95fe15e5a1dfc16aaf5bc66025f369e00dd AS build

ARG NUXT_PUBLIC_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_PUBLIC_STACK_DOMAIN=${NUXT_PUBLIC_STACK_DOMAIN}

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

ENV NODE_ENV=production
RUN corepack enable && \
    pnpm --dir nuxt run build


########################
# Nuxt: lint

# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:20.1.0-slim@sha256:80c3e9753fed11eee3021b96497ba95fe15e5a1dfc16aaf5bc66025f369e00dd AS lint

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN corepack enable && \
    pnpm --dir nuxt run lint


########################
# Nuxt: test (integration)

FROM cypress/included:12.11.0@sha256:29dfeed99db7a9678a4402f9175c98074c23bbb5ad109058702bc401fc3cdd02 AS test-integration_base

ARG UNAME=cypress
ARG UID=1000
ARG GID=1000

WORKDIR /srv/app/

RUN corepack enable \
    # user
    && groupadd -g $GID -o $UNAME \
    && useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

# Use the Cypress version installed by pnpm, not as provided by the Docker image.
COPY --from=prepare --chown=$UNAME /root/.cache/Cypress /root/.cache/Cypress

USER $UNAME

VOLUME /srv/app


########################
# Nuxt: test (integration, development)

FROM cypress/included:12.11.0@sha256:f9c3930d94b49104949d4ff4ed567d0bc76d76b1567e65938408e9dae26d1603 AS test-integration-dev

RUN corepack enable

WORKDIR /srv/app/

# Use the Cypress version installed by pnpm, not as provided by the Docker image.
COPY --from=prepare /root/.cache/Cypress /root/.cache/Cypress
COPY --from=prepare /srv/app/ ./

RUN pnpm --dir nuxt run test:integration:dev


########################
# Nuxt: test (integration, production)

FROM cypress/included:12.11.0@sha256:f9c3930d94b49104949d4ff4ed567d0bc76d76b1567e65938408e9dae26d1603 AS test-integration-prod

RUN corepack enable

WORKDIR /srv/app/

# Use the Cypress version installed by pnpm, not as provided by the Docker image.
COPY --from=prepare /root/.cache/Cypress /root/.cache/Cypress
COPY --from=build /srv/app/ /srv/app/
COPY --from=test-integration-dev /srv/app/package.json /tmp/test/package.json

RUN pnpm --dir nuxt run test:integration:prod


#######################
# Collect build, lint and test results.

# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:20.1.0-slim@sha256:80c3e9753fed11eee3021b96497ba95fe15e5a1dfc16aaf5bc66025f369e00dd AS collect

WORKDIR /srv/app/

COPY --from=build /srv/app/nuxt/.output ./.output
COPY --from=lint /srv/app/package.json /tmp/lint/package.json
COPY --from=test-integration-dev /srv/app/package.json /tmp/test/package.json
COPY --from=test-integration-prod /srv/app/package.json /tmp/test/package.json


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

FROM node:20.1.0-slim@sha256:80c3e9753fed11eee3021b96497ba95fe15e5a1dfc16aaf5bc66025f369e00dd AS production

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

COPY ./sqitch/ /srv/app/sqitch/
COPY ./docker/entrypoint.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
