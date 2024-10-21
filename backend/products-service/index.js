import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import db from "./configs/PrismaClient.js";
import { v4 as uuidv4 } from "uuid";

const PROTO_PATH = "./protos/product.proto";

const productProtoPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const productProto = grpc.loadPackageDefinition(productProtoPackageDefinition);

const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
  createProduct: async (call, callback) => {
    const { category, price, stock, name } = call.request;

    const product = await db.product.create({
      data: {
        id: uuidv4(),
        category,
        name,
        price,
        stock,
      },
    });

    if (!product)
      callback({
        code: grpc.status.CANCELLED,
        details: "Something went wrong",
      });

    callback(null, product);
  },

  deleteProduct: async (call, callback) => {
    const { id } = call.request;

    if (!id)
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Product id required",
      });

    const product = await db.product.delete({
      where: {
        id,
      },
    });
    if (!product)
      callback({ code: grpc.status.NOT_FOUND, details: "Product id invalid" });
    callback(null, product);
  },

  editProduct: async (call, callback) => {
    const id = call.request.id;

    if (!id)
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Product id required",
      });

    const requiredKeys = ["category", "price", "stock", "name"];

    const updateData = {};

    console.log(Object.keys(call.request));

    for (let key of requiredKeys) {
      if (Object.keys(call.request).includes(key)) {
        updateData[key] = call.request[key];
      }
    }

    console.log(updateData);

    const product = await db.product.update({
      where: {
        id,
      },
      data: { ...updateData },
    });
    if (!product)
      callback({ code: grpc.status.NOT_FOUND, details: "Product id invalid" });
    callback(null, product);
  },

  getAllProducts: async (call, callback) => {
    const products = await db.product.findMany({});

    callback(null, { products });
  },

  getProduct: async (call, callback) => {
    const productId = call.request.id;

    if (!productId)
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Product id required",
      });
    const product = await db.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product)
      callback({ code: grpc.status.NOT_FOUND, details: "Product id invalid" });
    callback(null, product);
  },
});

server.bindAsync(
  "127.0.0.1:30044",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) console.log(err);
    console.log("Product microservice running on port:", port);
  }
);
