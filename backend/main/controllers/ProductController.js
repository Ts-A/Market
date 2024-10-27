export default (service) => ({
  getProduct: (req, res) => {
    service.getProduct(
      { id: req.params.id },
      req.grpcMetadata,
      (err, product) => {
        if (err) return res.json({ err });
        return res.json({ product });
      }
    );
  },
  getAllProducts: (req, res) => {
    service.getAllProducts({}, (err, products) => {
      if (err) return res.json({ err });
      return res.json({ products });
    });
  },
  createProduct: (req, res) => {
    service.createProduct({ ...req.body, token: req.token }, (err, product) => {
      if (err) return res.json({ err });
      return res.json({ product });
    });
  },
  deleteProduct: (req, res) => {
    service.deleteProduct(
      { id: req.params.id, token: req.token },
      (err, product) => {
        if (err) return res.json({ err });
        return res.json({ product });
      }
    );
  },
  editProduct: (req, res) => {
    service.editProduct(
      { id: req.params.id, ...req.body, token: req.token },
      (err, product) => {
        if (err) return res.json({ err });
        return res.json({ product });
      }
    );
  },
});
