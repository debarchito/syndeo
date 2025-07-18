/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update collection data
    unmarshal(
      {
        listRule: '@request.auth.collectionName = "teachers" || @request.auth.id = id',
        viewRule: '@request.auth.collectionName = "teachers" || @request.auth.id = id',
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update collection data
    unmarshal(
      {
        listRule: "",
        viewRule: "",
      },
      collection,
    );

    return app.save(collection);
  },
);
