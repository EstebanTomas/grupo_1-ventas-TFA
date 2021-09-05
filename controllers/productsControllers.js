const path = require("path");
const fs = require("fs");
const { json } = require("express");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

var functionalities = require('../models/functionalities');

const productsControllers = {
  productCreate: (req, res) => {
    res.render("./product/productCreate");
  },
  create: (req, res) => {
    let productsJson = fs.readFileSync("./data/products.json", {
      encoding: "utf-8",
    });
    let dataOfProducts;
    // if userJson is not empty I store it in a variable.
    productsJson == ""
      ? (dataOfProducts = [])
      : (dataOfProducts = JSON.parse(productsJson));

    let product = {
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      size: req.body.size,
      models: req.body.models,
      gender: req.body.gender,
      category: req.body.category,
    };
    dataOfProducts.push(product);

    dataOfListProducts = JSON.stringify(dataOfProducts);
    fs.writeFileSync("./data/products.json", dataOfListProducts);

    res.redirect("/products/");
  },
  productDetail: (req, res) => {
    res.render("./product/productDetail");
  },
  editProduct: (req, res) => {
    //res.render("./product/productEdit");
  },
  edit: (req, res) => {
    // I store in name, the value that comes from the name field.
    var Name = req.body.name;
    // I bring the file products.json and convert it to either literal or array object format.
    let productsJson = fs.readFileSync("./data/products.json", {
      encoding: "utf-8",
    });
    let dataJSON = JSON.parse(productsJson);
    for (let i = 0; i <= dataJSON.length; i++) {
      if (dataJSON[i] == Name) {
        var data = dataJSON[i];
        return data;
      } else {
      }
    }
    res.send("hola");
  },
  productList: (req, res) => {
    res.render("./product/productList");
  },
  delete: (req, res) => {
    let productsOfJson = fs.readFileSync("./data/products.json", { encoding: "utf-8" });
    let productsNotRemoved = productsOfJson.filter(function (content) {
      return content.name != req.params.name;
    });

    let productosJSON = JSON.stringify(productsNotRemoved, null, '');
    fs.writeFileSync( "./data/products.json" , productosJSON);
    res.redirect("/products");
  },
};

module.exports = productsControllers;
