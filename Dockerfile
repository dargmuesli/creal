#############
# Serve Nuxt in development mode.

# Should be the specific version of node:buster-slim.
# `sqitch` requires at least buster.
FROM node:16.10.0-buster-slim@sha256:ef29052be591fd7ccc56da4a1478cf22557e5ddb6f4803a16c0806880908fa11 AS development

# Update and install dependencies.
# - `ca-certificates` and `git` are required by the `yarn install` command
# - `sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates git \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl \
        postgresql-client \
        sqitch \
    && apt-get install --no-install-recommends -y \
        curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY ./nuxt/package.json ./nuxt/yarn.lock ./

RUN yarn install

COPY ./nuxt/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dev", "--hostname", "0.0.0.0"]
HEALTHCHECK --interval=10s CMD curl -f http://localhost:3000/healthcheck || exit 1


########################
# Build Nuxt.

# Should be the specific version of node:slim.
FROM node:16.10.0-slim@sha256:ef29052be591fd7ccc56da4a1478cf22557e5ddb6f4803a16c0806880908fa11 AS build

ARG NUXT_ENV_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_ENV_STACK_DOMAIN=${NUXT_ENV_STACK_DOMAIN}
ENV NODE_ENV=production

# Update and install dependencies.
# - `ca-certificates` and `git` are required by the `yarn install` command
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY --from=development /srv/app/ ./

RUN yarn run build

# Discard devDependencies.
RUN yarn install


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of node:buster-slim.
# sqitch requires at least buster.
FROM node:16.10.0-buster-slim@sha256:ef29052be591fd7ccc56da4a1478cf22557e5ddb6f4803a16c0806880908fa11 AS production

ENV NODE_ENV=production

# Update and install dependencies.
# - `sqitch` is required by the entrypoint
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl \
        postgresql-client \
        sqitch \
    && apt-get install --no-install-recommends -y \
        curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY --from=build /srv/app/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nuxt", "start", "--hostname", "0.0.0.0"]
HEALTHCHECK --interval=10s CMD curl -f http://localhost:3000/healthcheck || exit 1