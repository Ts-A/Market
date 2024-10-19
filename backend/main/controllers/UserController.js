const UserController = {
  getUser: (req, res) => {
    return res.json({ message: "user" });
  },
  getAllUsers: (req, res) => {
    console.log(req.url);
    return res.json({ message: "all users" });
  },
};

export default UserController;
