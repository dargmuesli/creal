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

COPY ./nuxt/ ./

RUN yarn

# Install sqitch.
RUN apt-get update && apt-get -y install libdbd-pg-perl postgresql-client sqitch

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dev", "--hostname", "0.0.0.0"]


########################
# Build Nuxt.

FROM node:14.13.0-slim@sha256:8a1c2805842351c462d7482dea01600f92cae263146b2353f9e6e3f768d707a5 AS build

ARG STACK_DOMAIN=jonas-thelemann.de
ENV STACK_DOMAIN=${STACK_DOMAIN}
ENV NODE_ENV=production

# Update and install build dependencies
# - `git` is required by the `yarn` command
RUN \
    apt-get update && \
    apt-get install -y git

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
FROM node:14.13.0-buster-slim@sha256:3b6c2cd90b5b53ffd74a15c8ee199d29710a6d34d54a9b0dbadb1218517a9fd1 AS production

# Install sqitch.
RUN apt-get update && apt-get -y install libdbd-pg-perl postgresql-client sqitch

WORKDIR /srv/app/

COPY --from=build /srv/app/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nuxt-ts", "start", "--hostname", "0.0.0.0"]