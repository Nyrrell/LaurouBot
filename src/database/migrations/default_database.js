export async function up(knex) {
  await knex.schema.createTable("Youtube_Channel", (table) => {
    table.increments("id").primary();
    table.string("username");
    table.string("title");
    table.string("channelId").notNullable().unique();
    table.string("customUrl");
    table.string("uploadPlaylist");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("Youtube_Video", (table) => {
    table.string("id").primary();
    table.string("channel").notNullable();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("thumbnail").notNullable();
    table.string("channelId").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.foreign("channelId").references("channelId").inTable("Youtube_Channel");
  });

  await knex.schema.createTable("Youtube_Notification", (table) => {
    table.string("channelId").primary();
    table.text("message");
    table.string("role");
    table.string("discordChannel");
    table.boolean("active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.foreign("channelId").references("channelId").inTable("Youtube_Channel");
  });
}

export async function down(knex) {
  await knex.schema.dropTable("Youtube_Channel");
  await knex.schema.dropTable("Youtube_Video");
  await knex.schema.dropTable("Youtube_Notification");
}
