/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1219621782");

    // update field
    collection.fields.addAt(
      2,
      new Field({
        hidden: false,
        id: "select2363381545",
        maxSelect: 1,
        name: "type",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["subject", "class", "department"],
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1219621782");

    // update field
    collection.fields.addAt(
      2,
      new Field({
        hidden: false,
        id: "select2363381545",
        maxSelect: 1,
        name: "type",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["subject", "class"],
      }),
    );

    return app.save(collection);
  },
);
