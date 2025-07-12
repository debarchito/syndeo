/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3835949417");

    // update field
    collection.fields.addAt(
      3,
      new Field({
        hidden: false,
        id: "select2363381545",
        maxSelect: 1,
        name: "type",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["accepted", "rejected", "message", "dropped"],
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3835949417");

    // update field
    collection.fields.addAt(
      3,
      new Field({
        hidden: false,
        id: "select2363381545",
        maxSelect: 1,
        name: "type",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["accept", "reject", "message", "drop"],
      }),
    );

    return app.save(collection);
  },
);
