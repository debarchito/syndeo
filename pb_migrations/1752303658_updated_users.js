/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update field
    collection.fields.addAt(
      7,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1731158936",
        max: 255,
        min: 0,
        name: "displayName",
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

    // update field
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

    return app.save(collection);
  },
);
