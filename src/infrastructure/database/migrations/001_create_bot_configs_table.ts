import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("bot_configs", (table) => {
    table.increments("id").primary();      
    table.integer("bot_id").notNullable();     
    table.string("pair").notNullable();
    table.integer("interval").notNullable();
    table.decimal("threshold").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("bot_configs");
}