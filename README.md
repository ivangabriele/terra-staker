# Terra Staker

> A Terra wallet auto-staker.

- [Local Setup](#local-setup)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Run](#run)
- [Remote Deployment](#remote-deployment)
  - [Dokku](#dokku)
  - [Heroku](#heroku)

## Local Setup

### Prerequisites

- [Git](https://git-scm.com)
- [Node.js v16](https://nodejs.org)
- [Yarn v1](https://classic.yarnpkg.com)

### Install

```sh
git clone https://github.com/ivangabriele/terra-staker.git
cd terra-staker
yarn
cp ./.env.example ./.env
```

Set the `MNEMONIC` and `THRESHOLD` values in `.env`

### Run

```sh
yarn start
```

or `yarn dev` as a developer to auto-restart the app on changes.

## Remote Deployment

### Dokku

You just have to:

- Create a new Dokku app.
- Set its `MNEMONIC` and `THRESHOLD` config vars.
- Push the deployment as is on your new Dokku app.

### Heroku

[![Deploy Terra Staker to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy/?template=https://github.com/ivangabriele/terra-staker)
