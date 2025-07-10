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
        ],
        oauth2: {
          mappedFields: {
            avatarURL: "",
          },
        },
      },
      collection,
    );

    // remove field
    collection.fields.removeById("file376926767");

    // add field
    collection.fields.addAt(
      7,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1731158936",
        max: 255,
        min: 3,
        name: "displayName",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: "text",
      }),
    );

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 255,
        min: 3,
        name: "name",
        pattern: "^[a-z0-9_-]+$",
        presentable: false,
        primaryKey: false,
        required: true,
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
        ],
        oauth2: {
          mappedFields: {
            avatarURL: "avatar",
          },
        },
      },
      collection,
    );

    // add field
    collection.fields.addAt(
      7,
      new Field({
        hidden: false,
        id: "file376926767",
        maxSelect: 1,
        maxSize: 0,
        mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
        name: "avatar",
        presentable: false,
        protected: false,
        required: false,
        system: false,
        thumbs: null,
        type: "file",
      }),
    );

    // remove field
    collection.fields.removeById("text1731158936");

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 255,
        min: 0,
        name: "name",
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
);
