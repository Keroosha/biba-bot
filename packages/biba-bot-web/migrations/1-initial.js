exports.up = (knex) =>
  knex.schema.createTable("pidors", (t) => {
    t.increments();
    t.string("guildId").notNullable();
    t.string("pidorId").notNullable();
    t.string("randomHash").nullable();
    t.dateTime("assignDate").notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("pidors");
