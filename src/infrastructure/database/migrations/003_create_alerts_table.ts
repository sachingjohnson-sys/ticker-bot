import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("alerts", (table) => {
    table.increments("id").primary();
    table.integer("ticker_id").references("id").inTable("tickers").onDelete("CASCADE");
    table.integer("bot_config_id").references("id").inTable("bot_configs").onDelete("CASCADE");
    table.decimal("rate", 10,10).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("alerts");
}