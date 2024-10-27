import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { authUser } from "../helper/index.js";

const ALLOWED_ROLES = ["user", "system"];
const ALLOWED_UPDATES = ["email", "name"];

// TODO: Implement edit user
export default async (call, callback) => {
  try {
    const userPayload = await authUser(
      call.metadata.get("authorization")
        ? call.metadata.get("authorization")[0]
        : "",
      ALLOWED_ROLES
    );

    let updateData = {};

    for (let [key, value] of Object.entries(call.request)) {
      if (!ALLOWED_UPDATES.includes(key)) continue;

      /**
       * Todo email unique verification logic before update
       */
      if (key == "email") {
        continue;
      }

      updateData[key] = value;
    }

    console.log(updateData);

    const user = await db.user.update({
      where: {
        id: userPayload.id,
      },
      data: {
        ...updateData,
      },
    });

    if (!user) throw new Error("No user found");

    callback(null, { message: "User updated" });
  } catch (error) {
    console.log(error);
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
