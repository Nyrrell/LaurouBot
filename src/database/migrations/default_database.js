export async function up(knex) {
  await knex.schema.createTable("Youtube_Channel", (table) => {
    table.increments("id").primary();
    table.string("username");
    table.string("title");
    table.string("channelId").notNullable().unique();
    table.string("customUrl");
    table.string("uploadPlaylist");
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable("Youtube_Video", (table) => {
    table.string("id").primary();
    table.string("channel").notNullable();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("thumbnail").notNullable();
    table.string("channelId").notNullable();
    table.timestamps(true, true, true);

    table.foreign("channelId").references("channelId").inTable("Youtube_Channel").onDelete("CASCADE");
  });

  await knex.schema.createTable("Youtube_Notification", (table) => {
    table.string("channelId").primary();
    table.text("message");
    table.string("role");
    table.string("discordChannel");
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true, true);

    table.foreign("channelId").references("channelId").inTable("Youtube_Channel").onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTable("Youtube_Channel");
  await knex.schema.dropTable("Youtube_Video");
  await knex.schema.dropTable("Youtube_Notification");
}
