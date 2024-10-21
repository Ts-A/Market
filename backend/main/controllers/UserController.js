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
  createUser: (req, res) => {},
  deleteUser: (req, res) => {},
  updateUser: (req, res) => {},
});

export default UserController;
