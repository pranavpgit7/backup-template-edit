const userHelper = require("../helpers/userHelper")
const cartHelper = require('../helpers/cartHelper')
const userModel = require('../models/userSchema')
const bannerModel = require('../models/bannerSchema')
const { sendOtpApi, otpVerify } = require('../api/twilio')


module.exports = {
    
    //get Home Page
    
    getHomePage: (req, res) => {
        let users = req.session.user ? req.session.user._id : null;
        bannerModel.Banner.find().then((banner)=>{
            console.log(banner,'bannerr');
            res.render('user/home', { layout: 'Layout',users,banner})
        })
    },
    
    //Get Signup Page
    
    getSignupPage: (req, res) => {
         let users = req.session.user
        res.render('user/signup', { layout: 'Layout',users})
    },
    
    //Post Signup Page
    
    doSignup: (req, res) => {
        let data = req.body
        userHelper.doSignup(data).then((response) => {
            req.session.user = response.data
            res.send(response)
        })
    },

    //Get login Page
    
    getLoginPage: (req, res) => {
        let users = req.session.user ? req.session.user._id : null;
        if(!users){
        res.render('user/login', { layout: 'Layout',users})
    }else{
        res.redirect('/')
    }
    },
    
    // //Post Login

    dopostLogin: (req, res) => {
        // console.log(req.body, '-----------------------------------------------------');
        userHelper.loginPost(req.body).then((response) => {
            // console.log(response.users, '===++==')
            if (response.status) {
                req.session.user = response.users
                let users = req.session.user
                // console.log('iffff', users);
                res.render('user/home', { layout: 'Layout', users })
            } else {
                // console.log('elseeee');
                res.render('user/login', { layout: 'Layout', users })
            }
        })
    },

    // //GEt Contact Page

    // getContactPage: (req, res) => {
    //     res.render('user/contact', { layout: 'Layout' })
    // },
    

    // //GET Back page

    getBackPage: (req, res) => {
        res.redirect('back')
    },    

    // /* GET Otp Login Page. */

    otpLogin: async (req, res) => {
        const { mobileNumber } = req.body;
        req.session.number = mobileNumber;
        try {
            const user = await userHelper.getUserNumber(mobileNumber);
            if (user.status !== true) {
                return res.status(200).json({ error: true, message: 'Wrong Mobile Number' });
            }
            const status = await sendOtpApi(mobileNumber);
            if (!status) {
                return res.status(200).json({ error: true, message: 'Something went wrong' });
            }
            res.status(200).json({ error: false, message: 'Otp has been send successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error occured' });
        }
    },

    // /* GET Otp verify Page. */

    otpVerify: async (req, res) => {

        const { otp } = req.body;
        let number = req.session.number
        console.log(otp, req.body, number, '--');
        const user = await userModel.user.findOne({ mobile: number }).lean().exec()
        req.session.user = user;
        console.log(user);
        try {
            const status = await otpVerify(otp, number)

            if (!status) {
                res.status(200).json({ error: false, message: 'Something went wrong' })
            }
            res.status(200).json({ error: false, message: 'Otp has been verified' })

        } catch (error) {
            res.status(500).json({ message: 'Internal server error occured' })
        }
    },

    // // Post Logout Page.

    // doLogout: (req, res) => {
    //     console.log('00-');
    //     req.session.user = null
    //     res.render('user/home', { layout: 'Layout' })
    // },

    logout: (req, res) => {
        userHelper.destroySession(req);
        // res.render('user/home', { layout: 'Layout' });
        res.redirect('/')
      },

    // //Get Shop Page

    // getShopPage: (req, res) => {
    //     userHelper.getAllProducts().then((shop) => {
    //         // let users = req.session.user._id
    //         let users = req.session.user ? req.session.user._id : null;
    //         res.render('user/shop', { layout : 'Layout',shop,users})
    //     })
    // },
    getShopPage: async (req, res) => {
        try {

            let users = req.session.user ? req.session.user._id : null; 
        console.log('1');
        
            let count = await cartHelper.getCartCount(users._id)
            console.log('2'); 
            const page = parseInt(req.query?.page) || 1
            console.log('3');
            const perPage = 6
            if (req.query?.search || req.query?.sort || req.query?.filter) {
                console.log('4');
                const { product, currentPage, totalPages, noProductFound } = await userHelper.getQueriesOnShop(req.query)
                console.log('5');
                noProductFound ?
              
                    req.session.noProductFound = noProductFound
                 
                    : req.session.selectedProducts = product
                     console.log(product, users, count, currentPage, totalPages);
                res.render('user/shop', { layout: 'Layout', product, users, count,totalPages, currentPage, productResult: req.session.noProductFound })
            } else {
                let currentPage = 1
                const { product, totalPages } = await userHelper.getAllProducts(page, perPage);
                if (product?.length != 0)
                    req.session.noProductFound = false
                     console.log(product,'prooo');
                     console.log(product, users, count, totalPages, currentPage)
                res.render('user/shop', { layout: 'Layout', product, users, count, currentPage,totalPages, productResult: req.session.noProduct })
                req.session.noProductFound = false
            }

        } catch (error) {
            console.log(error)
        }
    },

    // //Get Product Details

    getProductDetails: (req, res) => {
        let proId = req.params.id
        let users = req.session.user ? req.session.user._id : null;
        userHelper.getProductDetails(proId).then((product) => {
            // console.log(product, '0099');
            res.render('user/productDetails', { layout: 'Layout', product,users})
        })

    },

    // /* GET EditProduct Page. */

    // getEditProduct: (req, res) => {
    //     let admin = req.session.admin
    //     let proId = req.params.id;
    //     adminHelpers.getEditProduct(proId).then(async (product) => {
    //         let category = await categoryModel.Category.find()
    //         res.render('admin/editProduct', { layout: 'adminLayout', product, category, admin })
    //     })

    // },

    getDetails: (userId) => {
        try {
            return new Promise((resolve, reject) => {
                userModel.user.findOne({ _id: userId }).then((user) => {
                    resolve(user)
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    // GET Profail
    getProfail: (req,res)=>{
        res.render('user/profail',{Layout :'layout'})
    }
    


};