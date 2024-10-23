import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import productHelper from "./helpers/index.js";

const PROTO_PATH = "./protos/product.proto";

const productProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const productProto = grpc.loadPackageDefinition(productProtoPackageDefinition);

const server = new grpc.Server();

server.addService(productProto.ProductService.service, productHelper);

server.bindAsync(
  "127.0.0.1:30044",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("Product microservice running on port:", port);
  }
);
