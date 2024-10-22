const UserController = (service) => ({
  getUser: (req, res) => {
    const authToken = req.headers["authorization"]
      ? req.headers["authorization"].split("Bearer ")[1]
      : "";
    if (!authToken) return res.json({ error: "must be authenticated" });
    service.getUser({ token: authToken }, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  getAllUsers: (req, res) => {
    service.getAllUsers({}, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  createUser: (req, res) => {
    service.createUser({ ...req.body }, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  deleteUser: (req, res) => {
    service.deleteUser({ ...req.body }, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  editUser: (req, res) => {
    service.editUser({ ...req.body }, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  loginUser: (req, res) => {
    service.loginUser({ ...req.body }, (err, token) => {
      if (err) return res.json({ err });
      return res.json({ token });
    });
  },
  logoutUser: (req, res) => {
    const authToken = req.headers["authorization"]
      ? req.headers["authorization"].split("Bearer ")[1]
      : "";
    if (!authToken) return res.json({ error: "must be authenticated" });
    service.logoutUser({ token: authToken }, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
});

export default UserController;
