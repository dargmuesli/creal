#############
# Serve Nuxt in development mode.

FROM node:20.5.1-slim@sha256:75404fc5825f24222276501c09944a5bee8ed04517dede5a9934f1654ca84caf AS development

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable

WORKDIR /srv/app/

COPY ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

VOLUME /srv/.pnpm-store
VOLUME /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "--dir", "src", "dev"]
EXPOSE 3000

# TODO: support healthcheck while starting (https://github.com/nuxt/framework/issues/6915)
# HEALTHCHECK --interval=10s --start-period=60s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

FROM node:20.5.1-slim@sha256:75404fc5825f24222276501c09944a5bee8ed04517dede5a9934f1654ca84caf AS prepare

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

FROM node:20.5.1-slim@sha256:75404fc5825f24222276501c09944a5bee8ed04517dede5a9934f1654ca84caf AS build

ARG NUXT_PUBLIC_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_PUBLIC_STACK_DOMAIN=${NUXT_PUBLIC_STACK_DOMAIN}

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

ENV NODE_ENV=production
RUN corepack enable && \
    pnpm --dir src run build


########################
# Nuxt: lint

FROM node:20.5.1-slim@sha256:75404fc5825f24222276501c09944a5bee8ed04517dede5a9934f1654ca84caf AS lint

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN corepack enable && \
    pnpm --dir src run lint


########################
# Nuxt: test (e2e)

FROM mcr.microsoft.com/playwright:v1.37.1@sha256:58a3daf48cde7d593e4fbc267a4435deb0016aef4c4179ae7fb8b2a68f968f36 AS test-e2e_base

ARG UNAME=e2e
ARG UID=1000
ARG GID=1000

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true
ENV NODE_ENV=development
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /srv/app/

COPY ./docker/entrypoint.dev.sh /usr/local/bin/docker-entrypoint.dev.sh

RUN corepack enable \
    # user
    && groupadd -g $GID -o $UNAME \
    && useradd -m -l -u $UID -g $GID -o -s /bin/bash $UNAME

USER $UNAME

VOLUME /srv/.pnpm-store
VOLUME /srv/app

ENTRYPOINT ["docker-entrypoint.dev.sh"]


########################
# Nuxt: test (e2e, preparation)

FROM mcr.microsoft.com/playwright:v1.37.1@sha256:58a3daf48cde7d593e4fbc267a4435deb0016aef4c4179ae7fb8b2a68f968f36 AS test-e2e-prepare

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /srv/app/

RUN corepack enable

COPY --from=prepare /srv/app/ ./

RUN pnpm rebuild -r


########################
# Nuxt: test (e2e, development)

FROM mcr.microsoft.com/playwright:v1.37.1@sha256:58a3daf48cde7d593e4fbc267a4435deb0016aef4c4179ae7fb8b2a68f968f36 AS test-e2e-dev

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true
ENV NODE_ENV=development

WORKDIR /srv/app/

RUN corepack enable

COPY --from=test-e2e-prepare /srv/app/ ./

RUN pnpm --dir src run test:e2e:dev


########################
# Nuxt: test (e2e, production)

FROM mcr.microsoft.com/playwright:v1.37.1@sha256:58a3daf48cde7d593e4fbc267a4435deb0016aef4c4179ae7fb8b2a68f968f36 AS test-e2e-prod

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

RUN corepack enable

COPY --from=test-e2e-prepare /srv/app/ ./
COPY --from=build /srv/app/src/.output /srv/app/src/.output

# # Do not run in parallel with `test-e2e-dev`
# COPY --from=test-e2e-dev /srv/app/package.json /tmp/test/package.json

RUN pnpm --dir src run test:e2e:prod


#######################
# Collect build, lint and test results.

FROM node:20.5.1-slim@sha256:75404fc5825f24222276501c09944a5bee8ed04517dede5a9934f1654ca84caf AS collect

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

COPY --from=build /srv/app/src/.output ./.output
COPY --from=build /srv/app/src/package.json ./package.json
COPY --from=lint /srv/app/package.json /tmp/package.json
COPY --from=test-e2e-dev /srv/app/package.json /tmp/package.json
COPY --from=test-e2e-prod /srv/app/package.json /tmp/package.json


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

FROM node:20.5.1-slim@sha256:75404fc5825f24222276501c09944a5bee8ed04517dede5a9934f1654ca84caf AS production

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true
ENV NODE_ENV=production

WORKDIR /srv/app/

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
# - `wget` is required by the healthcheck
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable

COPY --from=collect /srv/app/ ./

COPY ./sqitch/ /srv/app/sqitch/
COPY ./docker/entrypoint.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
CMD ["pnpm", "run", "start"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3001/api/healthcheck || exit 1
EXPOSE 3001
