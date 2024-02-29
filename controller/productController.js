const Product = require('../models/Product');

exports.populateProducts = async (req, res, next) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const productsFromApi = await response.json();

    productsFromApi.forEach(async (product) => {
      const newProduct = new Product({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      });

      await newProduct.save();
    });

    const products = await Product.find();
    return res.status(200).send({ products });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).send({ products });
  } catch (error) {
    next(error);
  }
};
