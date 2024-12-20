import cartClient from "../configs/CartClient.js";

export default (userId) => {
  return new Promise((resolve, reject) => {
    cartClient.deleteCart({ userId, cartId: "" }, (err, data) => {
      if (err) {
        reject({ message: err.details });
      }

      resolve(data);
    });
  });
};
