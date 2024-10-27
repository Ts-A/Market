export default (service) => ({
  showCart: (req, res) => {
    service.showCart({}, req.grpcMetadata, (err, cart) => {
      if (err) return res.json({ err });
      return res.json({ cart });
    });
  },
  addToCart: (req, res) => {
    service.addToCart({ ...req.body }, req.grpcMetadata, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
  removeFromCart: (req, res) => {
    service.removeFromCart(
      { ...req.body },
      req.grpcMetadata,
      (err, message) => {
        if (err) return res.json({ err });
        return res.json({ message });
      }
    );
  },
  emptyCart: (req, res) => {
    service.emptyCart({}, req.grpcMetadata, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
  checkoutCart: (req, res) => {
    service.checkoutCart({}, req.grpcMetadata, (err, message) => {
      if (err) return res.json({ err });
      return res.json({ message });
    });
  },
});
