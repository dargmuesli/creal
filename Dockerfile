#############
# Serve Nuxt in development mode.

# Should be the specific version of node:slim.
FROM node:16.18.1-slim@sha256:197c40ee61039103188b3a96046fb8c90fdf09b60f44c22a080bbe70b87c8a6f AS development

# Update and install dependencies.
# - `ca-certificates` and `git` are required by the `pnpm install` command
# - `sqitch` is required by the entrypoint
# - `wget` is required by the healthcheck
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates git \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl \
        postgresql-client \
        sqitch \
    && apt-get install --no-install-recommends -y \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY ./nuxt/package.json ./nuxt/pnpm-lock.yaml ./

RUN pnpm install

COPY ./nuxt/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dev", "--hostname", "0.0.0.0"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Build Nuxt.

# Should be the specific version of node:slim.
FROM node:16.18.1-slim@sha256:197c40ee61039103188b3a96046fb8c90fdf09b60f44c22a080bbe70b87c8a6f AS build

ARG NUXT_ENV_STACK_DOMAIN=jonas-thelemann.de
ENV NUXT_ENV_STACK_DOMAIN=${NUXT_ENV_STACK_DOMAIN}
ENV NODE_ENV=production

# Update and install dependencies.
# - `ca-certificates` and `git` are required by the `pnpm install` command
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY --from=development /srv/app/ ./

RUN pnpm run nuxi prepare \
    && pnpm run lint \
    && pnpm run build
    # && pnpm run test

# Discard devDependencies.
RUN pnpm install


#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of node:slim.
FROM node:16.18.1-slim@sha256:197c40ee61039103188b3a96046fb8c90fdf09b60f44c22a080bbe70b87c8a6f AS production

ENV NODE_ENV=production

# Update and install dependencies.
# - `sqitch` is required by the entrypoint
# - `wget` is required by the healthcheck
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl \
        postgresql-client \
        sqitch \
    && apt-get install --no-install-recommends -y \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY --from=build /srv/app/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1