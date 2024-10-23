import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = new Router();

export default (controller) => {
  userRouter.get(`/`, authMiddleware, controller.getUser);
  userRouter.get(`/all`, controller.getAllUsers);
  userRouter.post(`/login`, controller.loginUser);
  userRouter.post(`/logout`, authMiddleware, controller.logoutUser);
  userRouter.post(`/`, controller.createUser);
  userRouter.put(`/edit`, authMiddleware, controller.editUser);
  userRouter.delete(`/remove`, authMiddleware, controller.deleteUser);

  return userRouter;
};
