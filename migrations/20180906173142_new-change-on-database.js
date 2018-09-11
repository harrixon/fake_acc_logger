
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable("systemUsers", user => {
            user.increments("id").primary();
            user.string("UID").unique().notNullable();
            user.string("username").unique().notNullable();
            user.string("password").notNullable();
            user.timestamps(false, true);
        })
        .then(() => {
            return knex.schema
                .createTable("doppelganger", doppelganger => {
                    doppelganger.increments("id").primary();
                    doppelganger.string("ownerUID");
                    doppelganger.string("accID").unique();
                    doppelganger.string("serviceProvider").notNullable();
                    doppelganger.enum("loginType", ["local", "social"]).notNullable();
                    doppelganger.string("username");
                    doppelganger.string("email");
                    doppelganger.string("emailServiceProvider");
                    doppelganger.string("password");
                    doppelganger.string("remark").defaultTo("");
                    doppelganger.string("URL").defaultTo("");
                    doppelganger.timestamps(false, true);
                    doppelganger.boolean("isActive").defaultTo(true).notNullable();
                });
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable("doppelganger")
        .then(() => { return knex.schema.dropTable("systemUsers") });
};
