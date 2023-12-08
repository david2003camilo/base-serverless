# Serverless Service
This project was working with Node js v18.15.0 or higher and PostgreSQL are required.

## Environment
Create a enviroment file for development **.env.<eviroment>** and add the necessary configuration.

## Build for fist time the target
Run `npm run shared_build`. This build target of serverless for execute project local.

## Build of execute
Run `tsc` the project. The application will automatically reload if you change any of the source files.

## Specify the environment variable
Run `export NODE_ENV=<enviroment>`. You can see the file with enviroment .app/shared/base-handler/database/config/sequelizer-config-db.json

## Data base
This project was working with PostgreSQL. Too this is working with [Sequelize](doc:sequelize.org)

## Run lamdba
Run `sls invoke local -f <name-lamdba> --path ./mock/<name-file>.json`

## Development data base with docker
Run `docker-compose up` for a dev db. The db will automatically create database and tables
