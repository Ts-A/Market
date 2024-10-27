import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./protos/user.proto";

const userProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const UserService = grpc.loadPackageDefinition(
  userProtoPackageDefinition
).UserService;

export default new UserService(
  "localhost:30043",
  grpc.credentials.createInsecure()
);
