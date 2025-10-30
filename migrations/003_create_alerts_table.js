/**
 * @typedef {import('knex').Knex} Knex
 */

/**
 * Runs the "up" migration.
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('alerts', (table) => {
    table.increments('id').primary();
    table
      .integer('ticker_id')
      .references('id')
      .inTable('tickers')
      .onDelete('CASCADE');
    table
      .integer('bot_config_id')
      .references('id')
      .inTable('bot_configs')
      .onDelete('CASCADE');
    table.decimal('rate', 10, 10).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * Runs the "down" migration.
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('alerts');
}
