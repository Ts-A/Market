import { Router } from "express";

const userRouter = new Router();

export default (controller) => {
  userRouter.get(`/`, controller.getAllUsers);
  userRouter.post(`/login`, controller.loginUser);
  userRouter.post(`/logout`, controller.logoutUser);
  userRouter.get(`/:id`, controller.getUser);
  userRouter.post(`/`, controller.createUser);
  userRouter.put(`/:id`, controller.editUser);
  userRouter.delete(`/:id`, controller.deleteUser);

  return userRouter;
};
