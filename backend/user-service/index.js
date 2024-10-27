import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import userHandler from "./handler/index.js";

const PROTO_PATH = "./protos/user.proto";

const userProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const userProto = grpc.loadPackageDefinition(userProtoPackageDefinition);

const server = new grpc.Server();

server.addService(userProto.UserService.service, userHandler);

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("User microservice running on port:", port);
  }
);
