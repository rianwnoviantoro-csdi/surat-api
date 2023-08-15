import { createConnection } from "typeorm";

import { env, database } from "@configs/env";
import { UserRolePermission } from "@seeders/user-role-permission";

createConnection({
  type: "postgres",
  host: database.pgHost,
  port: database.pgPort,
  username: database.pgUser,
  password: database.pgPass,
  database: database.pgDBName,
  entities: ["src/entities/*.ts"],
  synchronize: env.env === "development" && true,
  logging: env.env === "development" && true,
})
  .then(async () => {
    console.log("Database connection established.");
    // Activate it the first time you start after install or the data in the users and roles table will be lost
    // await UserRolePermission();
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });
