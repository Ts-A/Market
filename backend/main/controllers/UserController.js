import { Metadata } from "@grpc/grpc-js";

export default (service) => ({
  getUser: (req, res) => {
    const metadata = new Metadata();
    metadata.add("authorization", req.token);
    service.getUser({ token: req.token }, metadata, (err, user) => {
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
    const metadata = new Metadata();
    metadata.add("authorization", req.token);
    service.deleteUser({}, metadata, (err, user) => {
      if (err) return res.json({ err });
      return res.json({ user });
    });
  },
  editUser: (req, res) => {
    const metadata = new Metadata();
    metadata.add("authorization", req.token);
    service.editUser({ ...req.body }, metadata, (err, user) => {
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
    const metadata = new Metadata();
    metadata.add("authorization", req.token);
    service.logoutUser({}, metadata, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
});
