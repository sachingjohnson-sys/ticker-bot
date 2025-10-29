import knexPkg from "knex";


import * as dotenv from "dotenv";
dotenv.config();
const knex = knexPkg.default || knexPkg;
export const dbConfig = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
  },
  pool: { min: 2, max: 10 },
};


export const db = knex(dbConfig);
