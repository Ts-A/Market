import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./protos/cart.proto";

const cartProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const CartService = grpc.loadPackageDefinition(
  cartProtoPackageDefinition
).CartService;

export default new CartService(
  "localhost:30045",
  grpc.credentials.createInsecure()
);
