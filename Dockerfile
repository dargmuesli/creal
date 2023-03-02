#############
# Serve Nuxt in development mode.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:19.7.0-slim@sha256:6f4a676c6f5b86910d59588373f9d2efd3568ed0065792e30db3043c6ba88639 AS development

COPY ./docker/entrypoint.sh /usr/local/bin/

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
VOLUME /srv/sqitch

ENTRYPOINT ["entrypoint.sh"]
CMD ["pnpm", "run", "dev"]

# Waiting for https://github.com/nuxt/framework/issues/6915
# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

# Should be the specific version of `node:slim`.
FROM node:19.7.0-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS prepare

WORKDIR /srv/app/

COPY ./nuxt/pnpm-lock.yaml ./

RUN corepack enable && \
    pnpm fetch

COPY ./nuxt/ ./

# TODO: create ticket about node-jiti folder (https://github.com/dargmuesli/jonas-thelemann/issues/178)
RUN pnpm install --offline \
    && rm -rf ./node-jiti


########################
# Build Nuxt.

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:19.7.0-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS build

ARG NUXT_PUBLIC_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_PUBLIC_STACK_DOMAIN=${NUXT_PUBLIC_STACK_DOMAIN}

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

ENV NODE_ENV=production
RUN corepack enable && \
    pnpm run build


########################
# Nuxt: lint

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:19.7.0-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS lint

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN corepack enable && \
    pnpm run lint


########################
# Nuxt: test (integration)

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.7.0@sha256:f740d5f4320d73721123a1c254d864c8cdac8a730c69e8d2c49dfe87463b3c66 AS test-integration_base

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

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.7.0@sha256:6c457d4826afd11d12f0a8af63e1c6319351fdad3fd2c9c4e7a6f0b38f7a97a8 AS test-integration-dev

RUN corepack enable

WORKDIR /srv/app/

# Use the Cypress version installed by pnpm, not as provided by the Docker image.
COPY --from=prepare /root/.cache/Cypress /root/.cache/Cypress
COPY --from=prepare /srv/app/ ./

RUN pnpm test:integration:dev


########################
# Nuxt: test (integration, production)

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.7.0@sha256:6c457d4826afd11d12f0a8af63e1c6319351fdad3fd2c9c4e7a6f0b38f7a97a8 AS test-integration-prod

RUN corepack enable

WORKDIR /srv/app/

# Use the Cypress version installed by pnpm, not as provided by the Docker image.
COPY --from=prepare /root/.cache/Cypress /root/.cache/Cypress
COPY --from=build /srv/app/ /srv/app/
COPY --from=test-integration-dev /srv/app/package.json /tmp/test/package.json

RUN pnpm test:integration:prod


#######################
# Collect build, lint and test results.

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:19.7.0-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS collect

WORKDIR /srv/app/

COPY --from=build /srv/app/.output ./.output
COPY --from=lint /srv/app/package.json /tmp/lint/package.json
COPY --from=test-integration-dev /srv/app/package.json /tmp/test/package.json
COPY --from=test-integration-prod /srv/app/package.json /tmp/test/package.json


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:19.7.0-slim@sha256:424dd181b3be2a7aec23f6ba3b69e732745bad42e9b8a473efcb1399e76f12de AS production

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
COPY ./docker/entrypoint.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
