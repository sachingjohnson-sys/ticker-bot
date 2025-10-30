/**
 * @typedef {import('knex').Knex} Knex
 */

/**
 * Runs the "up" migration.
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('tickers', (table) => {
    table.increments('id').primary();
    table.string('pair').notNullable();
    table.decimal('bid', 30, 20).notNullable();
    table.decimal('ask', 30, 20).notNullable();
    table.string('currency').notNullable();
    table
      .integer('bot_config_id')
      .references('id')
      .inTable('bot_configs')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * Runs the "down" migration.
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('tickers');
}
