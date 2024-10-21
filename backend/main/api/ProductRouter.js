import { Router } from "express";

const productRouter = new Router();

export default (controller) => {
  productRouter.get(`/`, controller.getAllProducts);
  productRouter.get(`/:id(\\d+)`, controller.getProduct);
  productRouter.post(`/`, controller.createProduct);
  productRouter.put(`/:id(\\d+)`, controller.updateProduct);
  productRouter.delete(`/:id(\\d+)`, controller.deleteProduct);

  return productRouter;
};
