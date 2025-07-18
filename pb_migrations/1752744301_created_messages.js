/** @type {import("../pb_data/types.d.ts") */
migrate(
  (app) => {
    const collection = new Collection({
      createRule:
        '(\n  @request.auth.collectionName = "users" &&\n  from_user.id = @request.auth.id &&\n  from_teacher = null\n) ||\n(\n  @request.auth.collectionName = "teachers" &&\n  from_teacher.id = @request.auth.id &&\n  from_user = null\n)',
      deleteRule:
        '(\n  @request.auth.collectionName = "users" &&\n  from_user.id = @request.auth.id &&\n  from_teacher = null\n) ||\n(\n  @request.auth.collectionName = "teachers" &&\n  from_teacher.id = @request.auth.id &&\n  from_user = null\n)',
      fields: [
        {
          autogeneratePattern: "[a-z0-9]{15}",
          hidden: false,
          id: "text3208210256",
          max: 15,
          min: 15,
          name: "id",
          pattern: "^[a-z0-9]+$",
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: "text",
        },
        {
          cascadeDelete: true,
          collectionId: "pbc_3085411453",
          hidden: false,
          id: "relation1923043739",
          maxSelect: 1,
          minSelect: 0,
          name: "room",
          presentable: false,
          required: true,
          system: false,
          type: "relation",
        },
        {
          autogeneratePattern: "",
          hidden: false,
          id: "text4274335913",
          max: 2000,
          min: 1,
          name: "content",
          pattern: "",
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: "text",
        },
        {
          cascadeDelete: false,
          collectionId: "_pb_users_auth_",
          hidden: false,
          id: "relation4161080234",
          maxSelect: 1,
          minSelect: 0,
          name: "from_user",
          presentable: false,
          required: false,
          system: false,
          type: "relation",
        },
        {
          cascadeDelete: false,
          collectionId: "pbc_3614170744",
          hidden: false,
          id: "relation916997498",
          maxSelect: 1,
          minSelect: 0,
          name: "from_teacher",
          presentable: false,
          required: false,
          system: false,
          type: "relation",
        },
        {
          hidden: false,
          id: "autodate2990389176",
          name: "created",
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: "autodate",
        },
        {
          hidden: false,
          id: "autodate3332085495",
          name: "updated",
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: "autodate",
        },
      ],
      id: "pbc_2605467279",
      indexes: [],
      listRule: "from_user.id = @request.auth.id || from_teacher.id = @request.auth.id",
      name: "messages",
      system: false,
      type: "base",
      updateRule:
        '(\n  @request.auth.collectionName = "users" &&\n  from_user.id = @request.auth.id &&\n  from_teacher = null\n) ||\n(\n  @request.auth.collectionName = "teachers" &&\n  from_teacher.id = @request.auth.id &&\n  from_user = null\n)',
      viewRule: "from_user.id = @request.auth.id || from_teacher.id = @request.auth.id",
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2605467279");

    return app.delete(collection);
  },
);
