/**
 * @typedef {import('knex').Knex} Knex
 */

/**
 * Run the migration.
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('bot_configs', (table) => {
    table.increments('id').primary();
    table.integer('bot_id').notNullable();
    table.string('pair').notNullable();
    table.integer('interval').notNullable();
    table.decimal('threshold').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * Roll back the migration.
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('bot_configs');
}
