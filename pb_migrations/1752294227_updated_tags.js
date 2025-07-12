/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1219621782");

    // update collection data
    unmarshal(
      {
        indexes: [
          "CREATE UNIQUE INDEX `idx_hjz9p7uqpk` ON `tags` (`name`)",
          "CREATE INDEX `idx_dD3oe2QSLA` ON `tags` (`type`)",
        ],
      },
      collection,
    );

    // add field
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
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1219621782");

    // update collection data
    unmarshal(
      {
        indexes: ["CREATE UNIQUE INDEX `idx_hjz9p7uqpk` ON `tags` (`name`)"],
      },
      collection,
    );

    // remove field
    collection.fields.removeById("select2363381545");

    return app.save(collection);
  },
);
