import { Router } from "express";

const productRouter = new Router();

export default (controller) => {
  productRouter.get(`/`, controller.getAllProducts);
  productRouter.get(`/:id`, controller.getProduct);
  productRouter.post(`/`, controller.createProduct);
  productRouter.put(`/:id`, controller.editProduct);
  productRouter.delete(`/:id`, controller.deleteProduct);

  return productRouter;
};
