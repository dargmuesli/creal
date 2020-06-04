#!/bin/sh
set -e

sqitch -C /srv/sqitch/ deploy "$(cat /run/secrets/creal_sqitch-target)"

if hash yarn 2>/dev/null
then
    exec yarn "$@"
else
    exec nginx -g "daemon off;"
fi