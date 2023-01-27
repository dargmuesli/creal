#############
# Serve Nuxt in development mode.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:19.5.0-slim@sha256:6d73ef33ffc88431447bcb9d5a299888345c4bb618575b5380939b5bb87ddf59 AS development

COPY ./docker/entrypoint.sh /usr/local/bin/

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

ENTRYPOINT ["entrypoint.sh"]
CMD ["pnpm", "run", "dev"]

# Waiting for https://github.com/nuxt/framework/issues/6915
# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

# Should be the specific version of `node:slim`.
FROM node:19.5.0-slim@sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS prepare

WORKDIR /srv/app/

COPY ./nuxt/pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm fetch

COPY ./nuxt/ ./

RUN pnpm install --offline \
    && rm -rf ./node-jiti


########################
# Build Nuxt.

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:19.5.0-slim@sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS build

ARG CI=false
ENV CI ${CI}
ARG NUXT_PUBLIC_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_PUBLIC_STACK_DOMAIN=${NUXT_PUBLIC_STACK_DOMAIN}

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

ENV NODE_ENV=production
RUN npm install -g pnpm && \
    pnpm run build


########################
# Nuxt: lint

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:19.5.0-slim@sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS lint

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run lint


########################
# Nuxt: test (integration)

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.4.1@sha256:55fe7d18fb1d26a3801fe421a8ca57fc619865e55753116a64693f2fd07588af AS test-integration_base

ARG UNAME=cypress
ARG UID=1000
ARG GID=1000

ENV CYPRESS_RUN_BINARY=/home/cypress/Cypress/Cypress
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
    && rm -rf /var/lib/apt/lists/* \
    && export CYPRESS_VERSION=$(ls /root/.cache/Cypress/) \
    && mkdir /home/cypress/.cache \
    && mv /root/.cache/Cypress/$CYPRESS_VERSION/Cypress /home/cypress/Cypress

RUN chown $UID:$GID /home/cypress/Cypress -R

USER $UID:$GID

VOLUME /srv/app


########################
# Nuxt: test (integration)

# Should be the specific version of `cypress/included`.
FROM cypress/included:12.4.1@sha256:55fe7d18fb1d26a3801fe421a8ca57fc619865e55753116a64693f2fd07588af AS test-integration

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
FROM node:19.5.0-slim@sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS collect

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
FROM node:19.5.0-slim@sha256:8886b323f04105798b3e5aac31ab7cc9ee35ae71099fbd7cd6645e1d165dbf94 AS production

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
