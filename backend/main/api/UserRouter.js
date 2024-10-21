import { Router } from "express";

const userRouter = new Router();

export default (controller) => {
  userRouter.get(`/`, controller.getAllUsers);
  userRouter.get(`/:id(\\d+)`, controller.getUser);
  userRouter.post(`/`, controller.createUser);
  userRouter.put(`/:id(\\d+)`, controller.updateUser);
  userRouter.delete(`/:id(\\d+)`, controller.deleteUser);

  return userRouter;
};
