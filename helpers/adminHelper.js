const adminModel = require("../models/adminSchema")
const userModel = require('../models/userSchema')
const productModel = require("../models/productSchema")
const categoryModel = require('../models/categorySchema')
const bannerModel = require('../models/bannerSchema')
const bcrypt = require('bcrypt')

module.exports = {


    /* Post Login Page. */
    doLogin: (data) => {
        console.log(data, 'ooo');
        try {
            return new Promise((resolve, reject) => {
                adminModel.Admin.findOne({ email: data.email }).then((admin) => {
                    if (admin) {
                        bcrypt.compare(data.password, admin.password).then((loginTrue) => {
                            resolve(loginTrue)
                        })
                    } else {
                        resolve(false)
                    }
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    /* GET User List Page. */
    getUserList: () => {
        try {
            return new Promise((resolve, reject) => {
                userModel.user.find().then((user) => {
                    if (user) {
                        resolve(user)
                    } else {
                        console.log("User not found");
                    }
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    changeUserStatus: (userId, status) => {
        return new Promise((resolve, reject) => {
            userModel.user.updateOne({ _id: userId }, { $set: { status: status } }).then((response) => {
                console.log(response, ")))))))))(((((((");
                if (response) {
                    resolve(response)
                } else {
                    console.log('user not found');
                }
            })
        })
    },

    //post add product
    postAddProduct: (data) => {
        console.log(data, 'dataaaa');
        try {
            return new Promise((resolve, reject) => {
                let product = new productModel.Product(data);
                product.save().then(() => {
                    resolve()
                })

            })
        } catch (error) {
            console.log(error.message);
        }
    },
      
    // Delete Category
    
    deleteCategory:(catId)=>{
        try{
          return new Promise((resolve,reject)=>{
            categoryModel.Category.findByIdAndDelete(catId).then((res)=>{
              if(res){
                resolve({status:true})
              }else{
                resolve({status:false})
  
              }
            })
          })
        }catch(error){
          console.log(error.message);
        }
      },

    //get product list
    getProductList: (req, res) => {
        return new Promise((resolve, reject) => {
            productModel.Product.find()
                .then((product) => {
                    if (!product) {
                        // If no product is found, reject the promise with an error
                        reject(new Error('No products found.'));
                    } else {
                        resolve(product);
                    }
                })
                .catch((error) => {
                    // Handle any other errors that may occur during the query
                    reject(error);
                });
        });
    },

    /* GET EditProduct Page. */
    getEditProduct: (proId) => {
        try {
            return new Promise((resolve, reject) => {
                productModel.Product.findById(proId).then((product) => {
                    if (product) {
                        resolve(product)
                    } else {
                        console.log('product not found');
                    }
                })
            })
        } catch (error) {
            console.log(error.message);
        }

    },
    //to get images for edit product
    getPreviousImages: (proId) => {
        try {
            return new Promise(async (resolve, reject) => {
                await productModel.Product.findOne({ _id: proId }).then((response) => {
                    resolve(response.img)
                })
            })
        } catch (error) {
            console.log(error.message);
        }

    },
    /* Post EditProduct Page. */
    postEditProduct: (proId, product, image) => {

        try {
            return new Promise((resolve, reject) => {
                productModel.Product.updateOne({ _id: proId },
                    {
                        $set:
                        {
                            name: product.name,
                            brand: product.brand,
                            description: product.description,
                            price: product.price,
                            quantity: product.quantity,
                            category: product.category,
                            img: image
                        }
                    }).then((newProduct) => {
                        resolve(newProduct)
                    })
            })
        } catch (error) {
            console.log(error.message);
        }
    },
    // Post DeleteProduct 
    // deleteProduct: (proId) => {
    //     console.log(proId);
    //     return new Promise((resolve, reject) => {
    //         productModel.Product.deleteOne({ _id: proId }).then((response) => {
    //             if (response) {
    //                 resolve({ status: true })
    //             } else {
    //                 resolve({ status: false })
    //             }
    //         })
    //     })
    // },
    unlistProduct: (proId, condition) => {
        return new Promise(async (resolve, reject) => {
            await productModel.Product.updateOne({ _id: proId },
                { $set: { unlist: condition } }).then((product) => {
                    resolve(product)
                }).catch((err) => {
                    reject(err)
                })
        })

    },

    // ADD CATEGORY
    addCategory: (data) => {

        try {
            return new Promise((resolve, reject) => {
                categoryModel.Category.findOne({ category: data.category }).then(
                    async (category) => {
                        if (!category) {
                            let category = categoryModel.Category(data);
                            await category.save().then(() => {
                                resolve({ status: true });
                            });
                        } else {
                            if (!category.sub_category.includes(data.sub_category)) {
                                categoryModel.Category.updateOne(
                                    { category: data.category },
                                    { $push: { sub_category: data.sub_category } }
                                ).then(() => {
                                    resolve({ status: true });
                                });
                            } else {
                                resolve({ status: false })
                            }
                        }
                    }
                )
            })
        }
        catch (error) {
            console.log(error.message);
        }
    },
    // GET EDIT CATEGORY
    getEditcategory: async (categoryId) => {

        try {
            return await categoryModel.Category.findById(categoryId)
        } catch (error) {
            console.log(error.message);
        }
    },
    // POST EDIT CATEGORY
    postEditcategory: (data) => {
        return new Promise((resolve, reject) => {
            try {
                categoryModel.Category.findByIdAndUpdate(
                    data._id,
                    { category: data.category },
                    { new: true }
                ).then((category) => {
                    resolve(category); // Resolve the promise with the updated category
                });
            } catch (error) {
                reject(error); // Reject the promise with the error
            }
        });
    },


    deleteProduct: (proId) => {
        console.log(proId);
        return new Promise((resolve, reject) => {
          productModel.Product.deleteOne({ _id: proId })
            .then((response) => {
              resolve({ status: !!response });
            })
            .catch((error) => {
              reject(error);
            });
        });
      },

         //ADD Banner
      addBanner: (texts, Image) => {
        console.log(texts,'textt');
    
        return new Promise(async (resolve, reject) => {
    
          let banner = bannerModel.Banner({
            title: texts.title,
            mainDescription: texts.mainDescription,
            subDescription: texts.subDescription,
            categoryOffer: texts.categoryOffer,
            image: Image
    
          })
          await banner.save().then((response) => {
            resolve(response)
          })
        })
      },
    
      //dashboard codes
      
      getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
          await productModel.Product.find().then((response) => {
            resolve(response);
          });
        });
      },
    
      getCodCount: () => {
        return new Promise(async (resolve, reject) => {
          let response = await orderModel.Order.aggregate([
            {
              $unwind: "$orders",
            },
            {
              $match: {
                "orders.paymentMethod": "COD",
              },
            },
          ]);
          resolve(response);
        });
      },
    
      getOnlineCount: () => {
        return new Promise(async (resolve, reject) => {
          let response = await orderModel.Order.aggregate([
            {
              $unwind: "$orders",
            },
            {
              $match: {
                "orders.paymentMethod": "razorpay",
              },
            },
          ]);
          resolve(response);
        });
      },
    
      getWalletCount:()=>
      {
        return new Promise(async (resolve, reject) => {
          let response = await orderModel.Order.aggregate([
            {
              $unwind: "$orders",
            },
            {
              $match: {
                "orders.paymentMethod": "wallet",
              },
            },
          ]);
          resolve(response);
        });
    
      },
    
      getBannerList:()=>{
       return new Promise((resolve,reject)=>{
        bannerModel.Banner.find().then((banner)=>{
            resolve(banner)
        })
       })
      },
    
      getEditBanner:(bannerId)=>{
        return new Promise((resolve,reject)=>{
            bannerModel.Banner.findOne({_id : bannerId}).then((bannerFound)=>{
            resolve(bannerFound)
            })
        })
      },
    
      postEditBanner:(bannerId,text,image)=>{
        return new Promise((resolve,reject)=>{
            bannerModel.Banner.updateOne(
                {_id : bannerId},
                {
                    $set:{
                        title : text.title,
                        description :text.description,
                        image : image
                    }
                }).then((bannerUpdated)=>{
                    resolve(bannerUpdated)
                })
        })
      },
    
      deleteBanner:(bannerId)=>{
        return new Promise((resolve,reject)=>{
            bannerModel.Banner.deleteOne({_id : bannerId}).then(()=>{
                resolve()
            })
        })
      }
      
}
