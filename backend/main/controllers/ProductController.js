const ProductController = (service) => ({
  getProduct: (req, res) => {
    service.getProduct({ id: req.params.id }, (err, product) => {
      if (err) return res.json({ err });
      return res.json({ product });
    });
  },
  getAllProducts: (req, res) => {
    service.getAllProducts({}, (err, products) => {
      if (err) return res.json({ err });
      return res.json({ products });
    });
  },
  createProduct: (req, res) => {},
  deleteProduct: (req, res) => {},
  updateProduct: (req, res) => {},
});

export default ProductController;
