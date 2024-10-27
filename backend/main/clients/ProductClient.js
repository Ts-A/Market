import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./protos/product.proto";

const productProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const ProductService = grpc.loadPackageDefinition(
  productProtoPackageDefinition
).ProductService;

export default new ProductService(
  "localhost:30044",
  grpc.credentials.createInsecure()
);
