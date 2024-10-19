export default (router, controller) => {
  router.get("/", controller.getAllUsers);

  router.get("/:id(\\d+)", controller.getUser);

  return router;
};
