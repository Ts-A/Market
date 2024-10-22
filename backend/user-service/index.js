import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import db from "./configs/PrismaClient.js";

const PROTO_PATH = "./protos/user.proto";

const userProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const userProto = grpc.loadPackageDefinition(userProtoPackageDefinition);

const server = new grpc.Server();

const users = [
  {
    id: "1",
    name: "ajeet",
  },
  {
    id: "2",
    name: "ananya",
  },
];

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
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("User microservice running on port:", port);
  }
);
