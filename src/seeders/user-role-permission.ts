import { getRepository, getConnection } from "typeorm";
import bcrypt from "bcrypt";

import Permission from "@entities/permission";
import Role from "@entities/role";
import User from "@entities/user";
import { v4 } from "uuid";

export const UserRolePermission = async () => {
  const connection = getConnection();

  const permissionEntityMetadata = connection.getMetadata(Permission);
  const roleEntityMetadata = connection.getMetadata(Role);
  const userEntityMetadata = connection.getMetadata(User);

  const permissionRepository = getRepository(Permission);
  const userRepository = getRepository(User);
  const roleRepository = getRepository(Role);

  await permissionRepository.delete({});
  await userRepository.delete({});
  await roleRepository.delete({});

  const permissionTable = permissionEntityMetadata.tableName;
  const roleTable = roleEntityMetadata.tableName;
  const userTable = userEntityMetadata.tableName;

  await connection.query(
    `TRUNCATE TABLE ${permissionTable} RESTART IDENTITY CASCADE`
  );
  await connection.query(
    `TRUNCATE TABLE ${roleTable} RESTART IDENTITY CASCADE`
  );
  await connection.query(
    `TRUNCATE TABLE ${userTable} RESTART IDENTITY CASCADE`
  );

  const permissionNameList = [
    "create:role",
    "read:role",
    "update:role",
    "delete:role",
    "create:permission",
    "read:permission",
    "update:permission",
    "delete:permission",
    "create:user",
    "read:user",
    "update:user",
    "delete:user",
  ];

  let permissionId = [];

  for (const permissionName of permissionNameList) {
    const newPermission = await permissionRepository.save({
      uuid: v4(),
      name: permissionName,
    });
    permissionId.push(newPermission);
  }

  const role = await roleRepository.save({
    uuid: v4(),
    name: "Super admin",
    permissions: permissionId,
  });

  await userRepository.save({
    uuid: v4(),
    name: "Super admin",
    email: "superadmin@seed.ts",
    password: await bcrypt.hash("Password!123", 10),
    role: role,
  });

  console.log("Seeded database tables");
};
