#!/bin/sh
set -e

sqitch -C /srv/sqitch/ deploy "$(cat /run/secrets/creal_sqitch-target)"

if hash nuxt-cli 2>/dev/null
then
    exec nuxt-cli "$@"
else
    exec nginx -g "daemon off;"
fi