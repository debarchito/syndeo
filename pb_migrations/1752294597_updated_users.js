/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update collection data
    unmarshal(
      {
        indexes: [
          "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)",
          "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''",
          "CREATE UNIQUE INDEX `idx_7X145YXfJZ` ON `users` (`name`)",
          "CREATE INDEX `idx_wPZW7nGwoD` ON `users` (`displayName`)",
        ],
      },
      collection,
    );

    // add field
    collection.fields.addAt(
      8,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1843675174",
        max: 500,
        min: 0,
        name: "description",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update collection data
    unmarshal(
      {
        indexes: [
          "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)",
          "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''",
          "CREATE UNIQUE INDEX `idx_7X145YXfJZ` ON `users` (`name`)",
        ],
      },
      collection,
    );

    // remove field
    collection.fields.removeById("text1843675174");

    return app.save(collection);
  },
);
