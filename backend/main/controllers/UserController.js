const UserController = (service) => ({
  getUser: (req, res) => {
    service.getUser({ token: req.token }, (err, user) => {
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
    service.deleteUser({ token: req.token }, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  editUser: (req, res) => {
    service.editUser({ token: req.token }, (err, user) => {
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
    service.logoutUser({ token: req.token }, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
});

export default UserController;
