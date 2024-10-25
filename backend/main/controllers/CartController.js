const CartController = (service) => ({
  showCart: (req, res) => {
    service.showCart({ token: req.token }, (err, cart) => {
      if (err) return res.json({ err });
      return res.json({ cart });
    });
  },
  addToCart: (req, res) => {
    service.addToCart({ token: req.token, ...req.body }, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
  removeFromCart: (req, res) => {
    service.removeFromCart(
      { token: req.token, ...req.body },
      (err, message) => {
        if (err) return res.json({ err });
        return res.json({ message });
      }
    );
  },
  emptyCart: (req, res) => {
    service.emptyCart({ token: req.token }, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
});

export default CartController;
