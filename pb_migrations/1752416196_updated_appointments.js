/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1037645436");

    // update field
    collection.fields.addAt(
      4,
      new Field({
        hidden: false,
        id: "date910263432",
        max: "",
        min: "",
        name: "startsOn",
        presentable: false,
        required: true,
        system: false,
        type: "date",
      }),
    );

    // update field
    collection.fields.addAt(
      5,
      new Field({
        hidden: false,
        id: "date1286299219",
        max: "",
        min: "",
        name: "endsOn",
        presentable: false,
        required: true,
        system: false,
        type: "date",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1037645436");

    // update field
    collection.fields.addAt(
      4,
      new Field({
        hidden: false,
        id: "date910263432",
        max: "",
        min: "",
        name: "starts_on",
        presentable: false,
        required: true,
        system: false,
        type: "date",
      }),
    );

    // update field
    collection.fields.addAt(
      5,
      new Field({
        hidden: false,
        id: "date1286299219",
        max: "",
        min: "",
        name: "ends_on",
        presentable: false,
        required: true,
        system: false,
        type: "date",
      }),
    );

    return app.save(collection);
  },
);
