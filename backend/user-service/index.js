import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import db from "./configs/PrismaClient.js";
import { v4 as uuidv4 } from "uuid";

const PROTO_PATH = "./protos/user.proto";

const userProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const userProto = grpc.loadPackageDefinition(userProtoPackageDefinition);

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  getUser: async (call, callback) => {
    const userId = call.request.id;

    if (!userId)
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "User id is required",
      });

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user)
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "User id invalid",
      });

    callback(null, user);
  },

  getAllUsers: async (call, callback) => {
    const users = await db.user.findMany({});

    if (!users)
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Something went wrong",
      });

    return callback(null, { users });
  },

  createUser: async (call, callback) => {
    const { name, email, role, password } = call.request;

    if (!name || !email || !role || !password)
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "missing fields required",
      });

    const existingUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser)
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        details: "user with email already exists",
      });

    const user = await db.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        role,
        password,
      },
    });

    if (!user)
      callback({ code: grpc.status.UNKNOWN, details: "something went wrong" });

    callback(null, user);
  },
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("User microservice running on port:", port);
  }
);
