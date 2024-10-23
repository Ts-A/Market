import db from "../configs/PrismaClient.js";

export default async (call, callback) => {
  const products = await db.product.findMany({});

  callback(null, { products });
};
