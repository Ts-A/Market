import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./protos/product.proto";

const productProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const productProto = grpc.loadPackageDefinition(productProtoPackageDefinition);

const server = new grpc.Server();

const products = [
  {
    id: "1",
    name: "box",
    category: "stationary",
    price: 500,
    stock: 10,
  },
  {
    id: "2",
    name: "bed",
    category: "furniture",
    price: 42000.0,
    stock: 20,
  },
];

server.addService(productProto.ProductService.service, {
  createProduct: () => {},
  deleteProduct: () => {},
  editProduct: () => {},
  getAllProducts: (call, callback) => {
    callback(null, products);
  },
  getProduct: () => {},
});

server.bindAsync(
  "127.0.0.1:30044",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("Product microservice running on port:", port);
  }
);
