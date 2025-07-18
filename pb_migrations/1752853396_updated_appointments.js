/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1037645436");

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.collectionName = "users" && sender.approved = true',
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1037645436");

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.collectionName = "users"',
      },
      collection,
    );

    return app.save(collection);
  },
);
