import cartClient from "../configs/CartClient.js";

export default (userId) => {
  return new Promise((resolve, reject) => {
    cartClient.createCart({ userId }, (err, data) => {
      if (err) reject(new Error(err.details));

      resolve(data.cartId);
    });
  });
};
