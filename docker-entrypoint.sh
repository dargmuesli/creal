#!/bin/sh
set -e

ENVIRONMENT_VARIABLES_PATH="/run/environment-variables"

for environment_variable_file in "$ENVIRONMENT_VARIABLES_PATH"/*; do
  if [ -f "$environment_variable_file" ]; then
    environment_variable_name=$(basename "$environment_variable_file")
    export "$environment_variable_name"="$(cat "$environment_variable_file")"
  fi
done

sqitch -C /srv/app/sqitch/ deploy "$(cat /run/secrets/creal_sqitch-target)"

if [ "$NODE_ENV" != "production" ]; then
    pnpm config set store-dir "/srv/.pnpm-store"
    pnpm install
fi

exec "$@"
