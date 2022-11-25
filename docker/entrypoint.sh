#!/bin/sh
set -e

sqitch -C /srv/sqitch/ deploy "$(cat /run/secrets/creal_sqitch-target)"

exec pnpm run "$@"