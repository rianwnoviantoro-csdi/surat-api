import { createConnection } from "typeorm";

import { env, database } from "../configs/env";
import { UserRolePermission } from "../seeders/user-role-permission";

import Permission from "../entities/permission";
import Role from "../entities/role";
import User from "../entities/user";
import IncomingMail from "../entities/incoming-mail";
import Disposition from "../entities/disposition";
import OutgoingMail from "../entities/outgoing-mail";
import Warrant from "../entities/warrant";

createConnection({
  type: "postgres",
  host: database.pgHost,
  port: database.pgPort,
  username: database.pgUser,
  password: database.pgPass,
  database: database.pgDBName,
  entities: [
    Permission,
    Role,
    User,
    IncomingMail,
    Disposition,
    OutgoingMail,
    Warrant,
  ],
  synchronize: true,
  logging: false,
})
  .then(async () => {
    console.log("Database connection established.");
    // Activate it the first time you start after install or the data in the users and roles table will be lost
    // await UserRolePermission();
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });
