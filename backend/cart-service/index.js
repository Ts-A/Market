import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import cartHelper from "./helper/index.js";

const PROTO_PATH = "./protos/cart.proto";

const cartProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const cartProto = grpc.loadPackageDefinition(cartProtoPackageDefinition);

const server = new grpc.Server();

server.addService(cartProto.CartService.service, cartHelper);

server.bindAsync(
  "127.0.0.1:30045",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("Cart microservice running on port:", port);
  }
);
