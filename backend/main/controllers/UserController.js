const UserController = (service) => ({
  getUser: (req, res) => {
    service.getUser({ id: req.params.id }, (err, user) => {
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
    service.loginUser({ ...req.body }, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  logoutUser: (req, res) => {
    // service.logoutUser({ ...req.body }, (err, user) => {});
  },
});

export default UserController;
