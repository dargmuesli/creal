############
# Serve Nuxt in development mode.

# Should be the specific version of node:buster-slim.
# sqitch requires at least buster.
FROM node:13.14.0-buster-slim@sha256:ffee53b7563851a457e5a6f485adbe28877cf92286cc7095806e09d721808669 AS development

# Update and install build dependencies
# - `git` is required by the `yarn` command
RUN \
    apt-get update && \
    apt-get install -y git

WORKDIR /srv/app/

COPY ./nuxt/ /srv/app/

RUN yarn

# Install sqitch.
RUN apt-get update && apt-get -y install libdbd-pg-perl postgresql-client sqitch

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dev", "--hostname", "0.0.0.0"]


########################
# Build Nuxt.

FROM node:14.7.0-slim@sha256:859c51a8718b6ef7781f62e9d2ffb78b9f7445329957f737f003a35841ddbf7c AS build

ARG STACK_DOMAIN=jonas-thelemann.de
ENV STACK_DOMAIN=${STACK_DOMAIN}

WORKDIR /srv/app/

COPY --from=development /srv/app/ /srv/app/

RUN yarn run build


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of node:buster-slim.
# sqitch requires at least buster.
FROM node:14.7.0-buster-slim@sha256:118d30450b0e419218e9b9a5ec08a744e5c0db10f65a577e20b427eacf59166c AS production

# Install sqitch.
RUN apt-get update && apt-get -y install libdbd-pg-perl postgresql-client sqitch

WORKDIR /srv/app/

COPY --from=build /srv/app/ /srv/app/

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nuxt-ts", "start", "--hostname", "0.0.0.0"]