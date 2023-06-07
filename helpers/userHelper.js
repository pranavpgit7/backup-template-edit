const bcrypt = require('bcrypt')
const userModel = require('../models/userSchema');
const productSchema = require('../models/productSchema');
// const user = require('../../models/user');


module.exports = {
    // signup

    doSignup: (userData) => {
        console.log(userData, "dhdhdh");
        let obj = {}

        return new Promise(async (resolve, reject) => {
            try {
                let email = userData.email;
                let existingUser = await userModel.user.findOne({ email }).maxTimeMS(30000);
                if (existingUser) {
                    resolve({ status: false });
                } else {
                    let hashedPassword = await bcrypt.hash(userData.password, 10);
                    let data = await userModel.user({
                        name: userData.name,
                        password: hashedPassword,
                        email: userData.email,
                        mobile: userData.mobile,
                    });
                    console.log(data, 'data');


                    await data.save().then((data) => {
                        obj.data = data
                        obj.status = true
                        resolve(obj);
                    });

                }
            }
            catch (err) {
                throw err;
            }
        })
    },

    //login

    loginPost: (userData) => {
        // console.log(userData, "userdata");
        let response = {};

        return new Promise(async (resolve, reject) => {
            let users = await userModel.user.findOne({ email: userData.email })
            // console.log("this is user -----", users)
            if (users) {

                bcrypt.compare(userData.password, users.password).then((status) => {
                    // console.log("this is bcrp dta", status);
                    if (status) {
                        console.log("login successfully")
                        response.users = users
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login falied")
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }

        })


    },

    //to get the user number for otp verification

    getUserNumber: (mobileNumber) => {
        try {
            return new Promise((resolve, reject) => {
                userModel.user.findOne({ mobile: mobileNumber }).then((user) => {
                    if (user) {
                        resolve({ status: true, message: "User found" });
                    } else {
                        resolve({ status: false, message: "User not found" })
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        } catch (error) {
            console.log(error.message);
        }
    },
    
    // logout

    destroySession: (req) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
        });
      },

  //to render the shop page
  getAllProducts: async (page, perPage) => {
    const skip = (page - 1) * perPage;
    const product = await productSchema.Product.find()
        .skip(skip)
        .limit(perPage);

    const totalProducts = await productSchema.Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);

    return {
        product,
        totalPages,
    };
},

    //Get Product Details

    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            productSchema.Product.findById({ _id: proId }).then((product) => {
                if (product) {
                    resolve(product)
                } else {
                    console.log('product not found');
                }
            })
        })
    },

    // GET User
    getUser: (userId) => {
        try {
            return new Promise((resolve, reject) => {
                userModel.user.findById({ _id: userId }).then((response) => {
                    resolve(response)
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    getQueriesOnShop: (query) => {
        const search = query?.search
        const sort = query?.sort
        const filter = query?.filter
        const page = parseInt(query?.page) || 1
        const perPage = 6


        return new Promise(async (resolve, reject) => {

            let filterObj = {}

            if (filter === 'category=Men') {
                filterObj = { category: 'Men' }
            } else if (filter === 'category=Women') {
                filterObj = { category: 'Women' }
            } else if (filter === 'category=Kid') {
                filterObj = { category: 'Kid' }
            }
            console.log(filterObj, 'filterObj');

            //Building search query

            let searchQuery = {}

            if (search) {
                searchQuery = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                }
            }

            //Building object based on query parameter

            let sortObj = {}

            if (sort === '-createdAt') {
                sortObj = { createdAt: -1 };
            } else if (sort === 'createdAt') {
                sortObj = { createdAt: 1 };
            } else if (sort === '-price') {
                sortObj = { price: -1 };
            } else if (sort === 'price') {
                sortObj = { price: 1 };
            }

            const skip = (page - 1) * perPage;
            const product = await productSchema.Product.find({
                ...searchQuery,
                ...filterObj,
            })
                .sort(sortObj)
                .skip(skip)
                .limit(perPage);


            const totalProducts = await productSchema.Product.countDocuments({
                ...searchQuery,
                ...filterObj,
            });

               console.log(searchQuery,'searchQuery');
               console.log(sortObj,'sortObj');
               console.log(skip,'skip');
               console.log(product,'product');
            console.log(totalProducts, 'totalProducts');

            const totalPages = Math.ceil(totalProducts / perPage);
            if (product.length == 0) {
                resolve({
                    noProductFound: true,
                    Message: "No results found.."
                })
            }
            resolve({
                product,
                noProductFound: false,
                currentPage: page,
                totalPages,
            });

        })

    },



}