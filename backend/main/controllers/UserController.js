export default (service) => ({
  getUser: (req, res) => {
    service.getUser({ token: req.token }, req.grpcMetadata, (err, user) => {
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
    service.deleteUser({}, req.grpcMetadata, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  editUser: (req, res) => {
    service.editUser({ ...req.body }, req.grpcMetadata, (err, user) => {
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
    service.logoutUser({}, req.grpcMetadata, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
});
