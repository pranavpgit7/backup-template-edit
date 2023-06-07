const express = require('express')
const adminHelper = require("../helpers/adminHelper")
const orderHelpers = require("../helpers/orderHelper")
// const productModel = require('../models/productSchema')
const userController = require('./userController')
const categoryModel = require('../models/categorySchema')




module.exports = {

    //login

    getAdminLogin: (req, res) => {
        res.render('admin/login', { layout: false })
    },

    //get Dashboard

    getAdminPage: (req, res) => {
        res.render('admin/dashboard', { layout: 'adminLayout' })
    },

    // Post Login Page. 

    postLogin: (req, res) => {
        let data = req.body
        console.log(data, 'iii');
        adminHelper.doLogin(data).then((loginAction) => {
            req.session.admin = loginAction
            res.send(loginAction)
        })
    },

    /* GET User List Page. */

    getUserList: (req, res) => {
        let admin = req.session.admin
        adminHelper.getUserList().then((user) => {
            console.log(user, 'user..//');
            res.render('admin/userList', { layout: 'adminLayout', user, admin })
        })
    },

    // Change User Status   

    changeUserStatus: (req, res) => {
        let userId = req.query.id
        let status = req.query.status
        console.log(userId, status, '))__');
        if (status === 'false') {
            req.session.user = null
        }
        adminHelper.changeUserStatus(userId, status).then((response) => {
            console.log(response, 'response--=');
            res.send(response)
        })
    },

    //Get Product List

    getProductList: (req, res) => {
        adminHelper.getProductList().then((product) => {
            console.log(product);
            res.render('admin/productList', { layout: 'adminLayout', product })
        })
    },

    //GET Add Product

    getAddProduct: (req, res) => {
        res.render('admin/addProduct', { layout: 'adminLayout' })
    },

    //POST Add Product

    postAddProduct: (req, res) => {
        console.log(req.body, '{{]]');
        let file = req.files
        const fileName = file.map((file) => {
            return file.filename
        })
        console.log(file);
        const product = req.body
        product.img = fileName
        adminHelper.postAddProduct(product).then(() => {
            res.redirect('/admin/dashboard')
        })
    },

    /* GET EditProduct Page. */

    getEditProduct: (req, res) => {
        let admin = req.session.admin
        let proId = req.params.id;
        adminHelper.getEditProduct(proId).then(async (product) => {
            // let category = await categoryModel.Category.find()
            res.render('admin/editProduct', { layout: 'adminLayout', product, admin })
        })

    },

    // Post Edit Product

    postEditProduct: async (req, res) => {
        let proId = req.params.id
        let file = req.files
        let image = [];

        let previousImages = await adminHelper.getPreviousImages(proId)

        console.log(previousImages, 'oldimage');
        console.log(file, 'uploaded');


        if (req.files.image1) {
            image.push(req.files.image1[0].filename)
        } else {
            image.push(previousImages[0])
        }

        if (req.files.image2) {
            image.push(req.files.image2[0].filename)
        } else {
            image.push(previousImages[1])
        }
        if (req.files.image3) {
            image.push(req.files.image3[0].filename)
        } else {
            image.push(previousImages[2])
        }
        if (req.files.image4) {
            image.push(req.files.image4[0].filename)
        } else {
            image.push(previousImages[3])
        }

        adminHelper.postEditProduct(proId, req.body, image).then(() => {
            res.redirect('/admin/productList')
        })
    },

    //  Delete Product

    // deleteProduct: (req, res) => {
    //     let proId = req.params.id
    //     adminHelper.deleteProduct(proId).then((response) => {
    //         console.log(response, '==++==');
    //         res.send(response)
    //     })
    // },
    unlistProduct: async (req, res) => {
        let condition = (req.body.condition);
        let proId = req.body.proId;
        await adminHelper.unlistProduct(proId, condition).then((product) => {
          res.json(true);
        });
      },

    // GET ADD CATEGORY

    getAddcategory: async (req, res) => {
        let admin = req.session.admin
        let categories = await categoryModel.Category.find()
        res.render('admin/addCategory', { layout: "adminLayout", categories, admin })
    },

    // POST ADD CATEGORY

    postAddcategory: (req, res) => {
        adminHelper.addCategory(req.body).then((response) => {
            res.redirect('/admin/addCategory')
        })
    },

    // GET EDIT CATEGORY

    getEditcategory: async (req, res) => {
        let categoryId = req.params.id

        const response = await adminHelper.getEditcategory(categoryId)
        console.log(response);
        res.send(response)
    },

    // POST EDIT CATEGORY

    postEditcategory: async (req, res) => {
        console.log(req.body);

        const data = req.body; // Assuming the necessary data is present in the request body

        const response = await adminHelper.postEditcategory(data);
        res.send(response);
    },

    // DELETE CATEGORY

    deleteCategory: (req, res) => {
        let catId = req.params.id;
        adminHelper.deleteCategory(catId).then((response) => {
            // console.log(catId,"ccccccccccc");
            res.send(response)
        })
    },

    /* GET Order List Page. */
    getOrderList: (req, res) => {
        let userId = req.params.id
        let admin = req.session.admin
        // orderHelpers.getAddress(userId).then((address) => {
        adminHelper.getUserList(userId).then((user) => {
            console.log(user, 'user');
            orderHelpers.getOrders(userId).then((order) => {
                // console.log(order.orders[0].shippingAddress[0].item.fname, 'order');
                res.render('admin/ordersList', { layout: 'adminLayout', user, userId, admin, order })
            })
        })
        // })
    },

    /* GET Order Details Page. */
    getOrderDetails: async (req, res) => {
        let admin = req.session.admin
        let orderId = req.query.orderId
        let userId = req.query.userId
        let userDetails = await userController.getDetails(userId)
        orderHelpers.getOrderAddress(userId, orderId).then((address) => {
            orderHelpers.getSubOrders(orderId, userId).then((orderDetails) => {
                orderHelpers.getOrderedProducts(orderId, userId).then((product) => {
                    orderHelpers.getTotal(orderId, userId).then((productTotalPrice) => {
                        orderHelpers.getOrderTotal(orderId, userId).then((orderTotalPrice) => {
                            // console.log('admin',admin,'admin');
                            // console.log('orderDetails',orderDetails,'orderDetails');
                            // console.log('address',address,'address');
                            // console.log('product',product,'product');
                            // console.log('productTotalPrice',productTotalPrice,'productTotalPrice');
                            // console.log('orderTotalPrice',orderTotalPrice,'orderTotalPrice');
                            // console.log('userDetails',userDetails,'userDetails');
                            // console.log('orderId',orderId,'orderId');
                            res.render('admin/orderDetails', {
                                layout: 'adminLayout', admin, userDetails,
                                address, product, orderId, orderDetails, productTotalPrice, orderTotalPrice
                            })
                        })
                    })
                })
            })
        })
    },

     // GET Add Banner
    getAddBanner:(req,res)=>{
        let admin = req.session.admin
        res.render('admin/addBanner',{layout : 'adminLayout',admin})
    },

    postAddBanner: (req, res) => {
        adminHelper.addBanner(req.body, req.file.filename).then((response) => {
          if (response) {
            console.log(response,'000');
            res.redirect("/admin/add-banner");
          } else {
            res.status(505);
          }
        });
      },

      getBannerList:(req,res)=>{
        let admin = req.session.admin
        adminHelper.getBannerList().then((banner)=>{
            console.log(banner,'banner');

            res.render('admin/bannerList',{layout : 'adminLayout',admin,banner})
        })
      },

      getEditBanner:(req,res)=>{
        let admin = req.session.admin
        adminHelper.getEditBanner(req.query.banner).then((banner)=>{
            res.render("admin/editBanner", {layout : "adminLayout", admin, banner})
        })
      },

      postEditBanner:(req,res)=>{
        console.log(req.query.editbanner,'req.query.editbanner');
        console.log( req.body,'req.body');
        console.log( req?.file?.filename,' req?.file?.filename');
        adminHelper.postEditBanner(req.query.editbanner, req.body, req?.file?.filename).then((response)=>{
            res.redirect("/admin/banner-list")
        })
      },

      deleteBanner:(req,res)=>{
        adminHelper.deleteBanner(req.params.id).then((response)=>{
            res.send(response)
        })
      }



}