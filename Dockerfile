############
# Serve Nuxt in development mode.

# Should be the specific version of node:buster-slim.
# sqitch requires at least buster.
FROM node:13.14.0-buster-slim@sha256:ffee53b7563851a457e5a6f485adbe28877cf92286cc7095806e09d721808669 AS development

# Update and install build dependencies
# - `ca-certificates` and `git` are required by the `yarn install` command
RUN \
    apt-get update \
    && apt-get install --no-install-recommends -y ca-certificates git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY ./nuxt/ ./

RUN yarn install

# Install sqitch.
RUN apt-get update \
    && apt-get install --no-install-recommends -y libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dev", "--hostname", "0.0.0.0"]


########################
# Build Nuxt.

FROM node:14.14.0-slim@sha256:3f0e71eee1467ac6d0a16ea66da16e1e0092c56d7e06ebaf2695b5de175cd4d9 AS build

ARG STACK_DOMAIN=jonas-thelemann.de
ENV STACK_DOMAIN=${STACK_DOMAIN}
ENV NODE_ENV=production

# Update and install build dependencies
# - `ca-certificates` and `git` are required by the `yarn install` command
RUN \
    apt-get update \
    && apt-get install --no-install-recommends -y ca-certificates git \
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
FROM node:14.14.0-buster-slim@sha256:8f417dc7877e271341473e9feae4696eb49219c83e5b760b5222845be0399dbf AS production

# Install sqitch.
RUN apt-get update \
    && apt-get install --no-install-recommends -y libdbd-pg-perl postgresql-client sqitch \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY --from=build /srv/app/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nuxt-ts", "start", "--hostname", "0.0.0.0"]