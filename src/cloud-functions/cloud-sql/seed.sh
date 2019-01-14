#!/bin/bash

export NODE_ENV=production 
npx knex migrate:rollback && npx knex migrate:latest && npx knex seed:run 