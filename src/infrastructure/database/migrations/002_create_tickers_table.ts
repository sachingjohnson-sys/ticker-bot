import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tickers", (table) => {
    table.increments("id").primary();
    table.string("pair").notNullable();
    table.decimal("bid").notNullable();
    table.decimal("ask").notNullable();
    table.string("currency").notNullable();
    table.integer("bot_config_id").references("id").inTable("bot_configs").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tickers");
}
