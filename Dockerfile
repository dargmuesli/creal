#############
# Create base image.

FROM node:22.20.0-slim AS base-image

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true

WORKDIR /srv/app/

RUN corepack enable \
  && apt-get update \
  && apt-get install --no-install-recommends -y \
      mkcert \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*


#############
# Serve Nuxt in development mode.

FROM base-image AS development

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

VOLUME /srv/.pnpm-store
VOLUME /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "--dir", "src", "run", "dev", "--host"]
EXPOSE 3000

# TODO: support healthcheck while starting (https://github.com/nuxt/framework/issues/6915)
# HEALTHCHECK --interval=10s --start-period=60s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

FROM base-image AS prepare

COPY ./pnpm-lock.yaml package.json ./

RUN pnpm fetch

COPY ./ ./

RUN pnpm install --offline


########################
# Build for Node deployment.

FROM prepare AS build-node

ENV NODE_ENV=production
RUN pnpm --dir src run build:node


# ########################
# # Build for static deployment.

# FROM prepare AS build-static

# ARG SITE_URL=https://localhost:3002
# ENV SITE_URL=${SITE_URL}

# ENV NODE_ENV=production
# RUN pnpm --dir src run build:static


########################
# Nuxt: lint

FROM prepare AS lint

RUN pnpm -r run lint


# ########################
# # Nuxt: test (unit)

# FROM prepare AS test-unit

# RUN pnpm -r run test


########################
# Nuxt: test (e2e, base-image)

FROM mcr.microsoft.com/playwright:v1.55.1 AS test-e2e-base-image

# The `CI` environment variable must be set for pnpm to run in headless mode
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /srv/app/

RUN corepack enable \
  && apt update && apt install mkcert


########################
# Nuxt: test (e2e)

FROM test-e2e-base-image AS test-e2e_development

ARG UNAME=e2e
ARG UID=1000
ARG GID=1000

COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN groupadd -g $GID -o $UNAME \
    && useradd -m -l -u $UID -g $GID -o -s /bin/bash $UNAME

USER $UNAME

VOLUME /srv/.pnpm-store
VOLUME /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]


########################
# Nuxt: test (e2e, preparation)

FROM test-e2e-base-image AS test-e2e-prepare

COPY --from=prepare /srv/app/ ./

RUN pnpm rebuild -r


# ########################
# # Nuxt: test (e2e, development)

# FROM test-e2e-prepare AS test-e2e-dev

# ENV NODE_ENV=development

# RUN pnpm --dir tests run test:e2e:server:dev


########################
# Nuxt: test (e2e, node)

FROM test-e2e-prepare AS test-e2e-node

COPY --from=build-node /srv/app/src/.output ./src/.output

RUN pnpm --dir tests run test:e2e:server:node


# ########################
# # Nuxt: test (e2e, static)

# FROM test-e2e-prepare AS test-e2e-static

# ARG SITE_URL=https://localhost:3002
# ENV SITE_URL=${SITE_URL}
# ARG PORT=3002
# ENV PORT=${PORT}

# COPY --from=build-static /srv/app/src/.output/public ./src/.output/public

# RUN pnpm --dir tests run test:e2e:server:static


#######################
# Collect build, lint and test results.

FROM base-image AS collect

COPY --from=build-node /srv/app/src/.output ./.output
COPY --from=build-node /srv/app/src/package.json ./package.json
# COPY --from=build-static /srv/app/package.json /tmp/package.json
COPY --from=lint /srv/app/package.json /tmp/package.json
# COPY --from=test-unit /srv/app/package.json /tmp/package.json
# COPY --from=test-e2e-dev /srv/app/package.json /tmp/package.json
COPY --from=test-e2e-node /srv/app/package.json /tmp/package.json
# COPY --from=test-e2e-static /srv/app/package.json /tmp/package.json


# #######################
# # Provide a web server.

# FROM nginx:1.25.2-alpine AS production

# # The `CI` environment variable must be set for pnpm to run in headless mode
# ENV CI=true
# ENV NODE_ENV=production

# WORKDIR /usr/share/nginx/html

# COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# COPY --from=collect /srv/app/.output/public/ ./

# HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
# EXPOSE 3000


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

FROM collect AS production

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

COPY ./sqitch/ ./sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "start:node"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
EXPOSE 3000
LABEL org.opencontainers.image.source="https://github.com/dargmuesli/creal"
LABEL org.opencontainers.image.description="DJ cReal's website."
