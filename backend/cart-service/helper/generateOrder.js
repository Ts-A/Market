import db from "../configs/PrismaClient.js";

export default (cart) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderSummary = {
        products: [],
      };
      for (let item of cart.products) {
        await db.product.update({
          where: {
            id: item.product.id,
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
        const addItemToCheckout = {
          ...item.product,
          quantity: item.quantity,
        };
        delete addItemToCheckout["stock"];
        orderSummary.products.push(addItemToCheckout);
      }

      resolve(orderSummary);
    } catch (error) {
      reject({ message: error.message });
    }
  });
};
