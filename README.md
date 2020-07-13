[![build status](https://github.com/dargmuesli/creal/workflows/Docker%20CI/badge.svg)](https://github.com/dargmuesli/creal/actions?query=workflow%3A%22Docker+CI%22 "build status")
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/dargmuesli/creal.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/dargmuesli/creal/context:javascript)

# cReal

cReal's website: [creal.jonas-thelemann.de](https://creal.jonas-thelemann.de).

<!-- ![Welcome](images/welcome.jpg "cReal") -->

## Table of Contents
1. **[Development](#development)**
1. **[Technology](#technology)**

## Development

This project is deployed within the [jonas-thelemann_stack](https://github.com/dargmuesli/jonas-thelemann_stack/) in accordance to the [DargStack template](https://github.com/dargmuesli/dargstack_template/) to make deployment a breeze.


### Sqitch

The database management tool *Sqitch* needs special configuration.

- run `mkdir -p /var/run/postgresql/` to create the database's socket mount point, which Sqitch uses to connect to the database
- run `cd sqitch` from this project's root directory
- run `cp SQITCH_TARGET.env.template SQITCH_TARGET.env` and fill in the correct target
- run `./sqitch` with appropriate parameters

  (optionally, add an `alias sqitch="./sqitch"` to your shell, so that you can run `sqitch` like a binary without the preceding location indicator)


## Technology

[![Nuxt.js](https://nuxtjs.org/logos/nuxtjs-typo.svg)](https://nuxtjs.org/)
[![PostGraphile](https://www.graphile.org/static/postgres_postgraphile_graphql-4b238552d875fe06196ba3bda74c6d2b.png)](https://www.graphile.org/)
[![Sqitch](https://sqitch.org/img/sqitch-logo.svg)](https://sqitch.org/)
