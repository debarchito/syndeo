/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2605467279");

    // update collection data
    unmarshal(
      {
        listRule:
          "from_user.id = @request.auth.id || to_teacher.id = @request.auth.id || from_teacher.id = @request.auth.id || to_user.id = @request.auth.id",
        viewRule:
          "from_user.id = @request.auth.id || to_teacher.id = @request.auth.id || from_teacher.id = @request.auth.id || to_user.id = @request.auth.id",
      },
      collection,
    );

    // add field
    collection.fields.addAt(
      4,
      new Field({
        cascadeDelete: false,
        collectionId: "pbc_3614170744",
        hidden: false,
        id: "relation1047436064",
        maxSelect: 1,
        minSelect: 0,
        name: "to_teacher",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    // add field
    collection.fields.addAt(
      6,
      new Field({
        cascadeDelete: false,
        collectionId: "_pb_users_auth_",
        hidden: false,
        id: "relation1786627974",
        maxSelect: 1,
        minSelect: 0,
        name: "to_user",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2605467279");

    // update collection data
    unmarshal(
      {
        listRule: "from_user.id = @request.auth.id || from_teacher.id = @request.auth.id",
        viewRule: "from_user.id = @request.auth.id || from_teacher.id = @request.auth.id",
      },
      collection,
    );

    // remove field
    collection.fields.removeById("relation1047436064");

    // remove field
    collection.fields.removeById("relation1786627974");

    return app.save(collection);
  },
);
