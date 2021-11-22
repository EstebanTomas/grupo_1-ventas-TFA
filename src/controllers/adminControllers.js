const fs = require('fs');
const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const multer = require('multer');
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Association } = require('sequelize');
const { reset } = require('nodemon');
const { error } = require('jquery');
const { data } = require("jquery");

const User = db.User;
const Image = db.UserImg;

const adminControllers = {
  // ***USERS***
  saveRegister: function (req, res) {
    let errors = validationResult(req);
    User.findAll()
      .then(users => {
        if (users.email != req.body.email) {
          if (errors.isEmpty()) {
            User.create({
              name: req.body.name,
              lastname: req.body.lastName,
              email: req.body.email,
              password: bcryptjs.hashSync(req.body.password, 10),
              role: 1
            })
              .then((user) => {
                Image.create({
                  avatar: req.file ? req.file.filename : "user_anonimo.jpg",
                  user_id: user.id
                });
              })
              .then(() => {
                return res.redirect("/users/login");
              })
              .catch((error) => {
                return res.send(error)
              });
          } else {
            res.render("./users/register", { errors: errors.mapped(), incomingData: req.body })
          }
        } else {
          return res.render("./users/register", { errors: errors.mapped(), incomingData: req.body })
        }
      });
  },
  updateRegister: function (req, res) {
    User.findByPk(req.params.id, {
      include: ["Image"]
    })
      .then(users => {
        return res.render("./users/userEdit", { "user": users });
      })
      .catch((error) => {
        return res.send(error)
      });
  },
  save: function (req, res) {
    User.update({
      name: req.body.name,
      lastname: req.body.lastName,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 10),
      role: 9
    }, {
      where: { id: req.params.id }
    })
      .then(() => {
        Image.update({
          avatar: req.file ? req.file.filename : "user_anonimo.jpg",
          user_id: req.params.id
        }, {
          where: { user_id: req.params.id }
        })
      })
      .then(() => {
        return res.redirect('/')
      })
      .catch((error) => {
        return res.send(error)
      });
  },

  // ***PRODUCTS***
  adminProducts: (req, res) => {
    db.Product.findAll({
      include: [{ Association: "images" },{ Association: "sizes" }]
    })
      .then(products => {
        res.render("./admin/productsAdmin", { products });
      })
      .catch(error => {
        return res.send(error);
      });
  },
  productCreate: (req, res) => {
    res.render("./admin/productCreate");
  },
  create: (req, res) => {
    console.log(req.body);
    // ** products
    db.Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      gender: req.body.gender,
      category: req.body.category
    })
<<<<<<< HEAD
      .then(product => {
        // ** sizes
        let sizes = req.body.sizes;
        let xsData = 0;
        let sData = 0;
        let mData = 0;
        let lData = 0;
        let xlData = 0;
        if (sizes.includes("xs")) {
          xsData = 1;
        }
        if (sizes.includes("s")) {
          sData = 1;
        }
        if (sizes.includes("m")) {
          mData = 1;
        }
        if (sizes.includes("l")) {
          lData = 1;
        }
        if (sizes.includes("xl")) {
          xlData = 1;
        }
        db.Size.create({
          product_id: product.id,
          xs: xsData,
          s: sData,
          m: mData,
          l: lData,
          xl: xlData
        })
        //** images 
        let img0 = db.Image.create({
          img: req.files[0].filename,
          product_id: product.id
        })
        let img1 = db.Image.create({
          img: req.files[1].filename,
          product_id: product.id
        })
        let img2 = db.Image.create({
          img: req.files[2].filename,
          product_id: product.id
        })
        Promise.all([img0, img1, img2])
        // // ** models ++TODAVIA NO FUNCIONA CREAR LOS MODELOS++
        // let models = req.body.models;
        // for ( model of models) {
        //   db.Model.create({
        //     img: null,
        //     colors: models
        //   })
        // })
=======
    .then( product => {
      //** images 
      let img0 = db.Image.create({
        img: req.files[0].filename,
        product_id: product.id
      })
      let img1 = db.Image.create({
        img: req.files[1].filename,
        product_id: product.id
>>>>>>> 1fcfd2ea3ddd8b821b0113d7e504b6a337f7aae4
      })
      .then(() => {
        res.redirect("/products/");
      })
<<<<<<< HEAD
      .catch(error => {
        return res.send(error);
      });
=======
      Promise.all([img0, img1, img2])
      .then ( images => {
        // ** sizes
        let sizes = req.body.sizes;
        let xsData = 0;
        let sData = 0;
        let mData = 0;
        let lData = 0;
        let xlData = 0;
        if (sizes.includes("xs")) {
          xsData = 1;
        }
        if (sizes.includes("s")) {
          sData = 1;
        }
        if (sizes.includes("m")) {
          mData = 1;
        }
        if (sizes.includes("l")) {
          lData = 1;
        }
        if (sizes.includes("xl")) {
          xlData = 1;
        }
        db.Size.create({
          product_id: product.id,
          xs: xsData,
          s: sData,
          m: mData,
          l: lData,
          xl: xlData
        });
      })
      .catch(error => {
        return res.send(error);
      })
      .then ( sizes => {
        // ** models
        let models = req.body.models;
        for (let i = 0; i < models.length; i++) {
          db.Model.create({
            img: null,
            colors: req.body.models[i]
          })
          .then ( model => {
            // console.log(model.id);
            // console.log(product.id);
            db.ProductModel.create({
              product_id: product.id,
              model_id: model.id
            })
          })
          .catch(error => {
            return res.send(error);
          })
        }
      })
      .catch(error => {
        return res.send(error);
      })
    })
    .then(() => {
      res.redirect("/administration/products");
    })
    .catch(error => {
      return res.send(error);
    });
>>>>>>> 1fcfd2ea3ddd8b821b0113d7e504b6a337f7aae4
  },
  editProduct: (req, res) => {
    db.ProductModel.findAll({
      where: { 
        product_id: req.params.id 
      },
      include: ['model']
    })
<<<<<<< HEAD
      .then(product => {
        res.render("./admin/productEdit", { product });
      })
      .catch(error => {
        return res.send(error);
      });
=======
    .then(data => {
      db.Product.findByPk(req.params.id, {
        include: ['images', 'sizes', 'product_models']
      })
      .then(product => {
        // console.log(data[0].model.colors);
        res.render("./admin/productEdit", { product, data });
      })
      .catch(error => {
        return res.send(error);
      });  
    })
    .catch(error => {
      return res.send(error);
    });
>>>>>>> 1fcfd2ea3ddd8b821b0113d7e504b6a337f7aae4
  },
  // ** NO FUNCIONA TODAVIA
  edit: (req, res) => {
<<<<<<< HEAD
    console.log(req.body);
    // ** products
    db.Product.update({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      gender: req.body.gender,
      category: req.body.category
    }, {
      where: { id: req.params.id }
    })
      .then(product => {
        // ** sizes
        let sizes = req.body.sizes;
        let xsData = 0;
        let sData = 0;
        let mData = 0;
        let lData = 0;
        let xlData = 0;
        if (sizes.includes("xs")) {
          xsData = 1;
        }
        if (sizes.includes("s")) {
          sData = 1;
        }
        if (sizes.includes("m")) {
          mData = 1;
        }
        if (sizes.includes("l")) {
          lData = 1;
        }
        if (sizes.includes("xl")) {
          xlData = 1;
        }
        db.Size.update({
          product_id: product.id,
          xs: xsData,
          s: sData,
          m: mData,
          l: lData,
          xl: xlData
        }, {
          where: { product_id: req.params.id }
        })
        // // ** models ++TODAVIA NO FUNCIONA EDITAR LOS MODELOS++
        // let models = req.body.models;
        // for ( model of models) {
        //   db.Model.create({
        //     img: null,
        //     colors: models
        //   })
        // })
      })
      //** images ++TODAVIA NO FUNCIONA EDITAR LAS IMAGENES++
      // db.Product.findByPk(req.params.id, {
      //   include: ['images', 'sizes', 'models']
      // })
      // .then((product) => {
      //   if (req.files != '') {
      //     fs.unlinkSync(`./public/img/productImage/${product.images[0].img}`);
      //     fs.unlinkSync(`./public/img/productImage/${product.images[1].img}`);
      //     fs.unlinkSync(`./public/img/productImage/${product.images[2].img}`);

      //     let img0 = db.Image.update({
      //       img: req.files[0].filename,
      //     }, {
      //       where: { id: product.images[0].id }
      //     });

      //     let img1 = db.Image.update({
      //       img: req.files[1].filename,
      //     }, {
      //       where: { id: product.images[1].id }
      //     });

      //     let img2 = db.Image.update({
      //       img: req.files[2].filename,
      //     }, {
      //       where: { id: product.images[2].id }
      //     });

      //     Promise.all([img0, img1, img2])
      //   }
      // })
      .then(() => {
        res.redirect("/products/");
      })
      .catch(error => {
        return res.send(error);
      });
  },
  delete: (req, res) => {
    db.Size.destroy({
=======
  //   console.log(req.body);
  //   // ** products
  //   db.Product.update({
  //     name: req.body.name,
  //     description: req.body.description,
  //     price: req.body.price,
  //     gender: req.body.gender,
  //     category: req.body.category
  //   }, {
  //     where: {id: req.params.id}
  //   })
  //   .then( product => {
  //     // ** sizes
  //     let sizes = req.body.sizes;
  //     let xsData = 0;
  //     let sData = 0;
  //     let mData = 0;
  //     let lData = 0;
  //     let xlData = 0;
  //     if (sizes.includes("xs")) {
  //       xsData = 1;
  //     }
  //     if (sizes.includes("s")) {
  //       sData = 1;
  //     }
  //     if (sizes.includes("m")) {
  //       mData = 1;
  //     }
  //     if (sizes.includes("l")) {
  //       lData = 1;
  //     }
  //     if (sizes.includes("xl")) {
  //       xlData = 1;
  //     }
  //     db.Size.update({
  //       product_id: product.id,
  //       xs: xsData,
  //       s: sData,
  //       m: mData,
  //       l: lData,
  //       xl: xlData
  //     }, {
  //       where: {product_id: req.params.id}
  //     })
  //     // .then ( sizes => {
  //     //   // ** models
  //     //   let models = req.body.models;
  //     //   for ( model of models) {
  //     //     db.Model.create({
  //     //       img: null,
  //     //       colors: models
  //     //     })
  //     //   }
  //     // })
  //     // .catch(error => {
  //     //   return res.send(error);
  //     // })
  //     .then ( models => {
  //       // ** images
  //       db.Image.findAll({
  //         where: { 
  //           product_id: req.params.id 
  //         },
  //       })
  //       .then( data => {
  //         for( let i = 0; i < data.length; i++) {
  //           db.Image.update({
  //             img: req.files[i].filename,
  //           }, {
  //             where: {id: data[i].id}
  //           });
  //         }
  //       })
  //       .catch(error => {
  //         return res.send(error);
  //       })
  //     })
  //   })
  //   .then(() => {
  //     res.redirect("/administration/products");
  //   })
  //   .catch(error => {
  //     return res.send(error);
  //   })
  },
  delete: (req, res) => {

    let sizes = db.Size.destroy({
      where: {
        product_id: req.params.id
      }
    })

    let images = db.Image.destroy({
>>>>>>> 1fcfd2ea3ddd8b821b0113d7e504b6a337f7aae4
      where: {
        product_id: req.params.id
      }
    })
<<<<<<< HEAD
      // ++TODAVIA NO FUNCIONA BORRAR LOS MODELOS++
      // .then(() => {
      //   db.Model.destroy({
      //     where: {
      //       product_id: req.params.id
      //     }
      //   })
      // })
      .then(() => {
        db.Image.destroy({
          where: {
            product_id: req.params.id
          }
        })
      })
      .then(() => {
        db.Product.destroy({
          where: {
            id: req.params.id
          }
        })
      })
      .then(() => {
        res.redirect("/administration/products");
      })
      .catch(error => {
        return res.send(error);
      });
  },
  destroyUser: (req, res) => {
    db.User.findByPk(req.params.id, {
      include: ["Images"]
    }).then((usersToDelete) => {
      res.render("./users/deleteUser", {
        "delete": usersToDelete
      });
    }).catch(error => {
=======

    let product = db.Product.destroy({
      where: {
        id: req.params.id
      }
    })
    
    let product_models = db.ProductModel.destroy({
      where: {
        product_id: req.params.id
      }
    })

    Promise.all([sizes, images, product, product_models])

    .then(() => {
      res.redirect("/administration/products");
    })
    .catch(error => {
>>>>>>> 1fcfd2ea3ddd8b821b0113d7e504b6a337f7aae4
      return res.send(error);
    });
  },
  deleteUsers: (req, res) => {
    let imgUser = db.User.destroy({
      where: {
        user_id: req.params.id
      }
    });
    let user = db.User.destroy({
      where: {
        id: req.params.id
      }
    });
    Promise.all([imgUser, user])
      .then(() => {

      });
  }
}

module.exports = adminControllers;