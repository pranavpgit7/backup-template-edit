const express = require('express')
const cartHelper = require('../helpers/cartHelper')
const orderHelper = require('../helpers/orderHelper')


module.exports = {

getCart: async (req, res) => {
    let userId = req.session.user ? req.session.user._id : null;
  
    if (!userId) {
      // Handle the case when the user is not logged in
      // For example, you could redirect them to a login page or show an error message
      return res.redirect('/login'); // Replace '/login' with the appropriate login page URL
    }
  
    let user = req.session.user;
    let count = await cartHelper.getCartCount(userId);
    let total = await orderHelper.totalCheckOutAmount(userId);
    let subTotal = await orderHelper.getSubTotal(userId);
    
    cartHelper.getCartItems(userId).then((cartItems) => {
      res.render('user/shopCart', { layout: 'Layout', users: userId, user, cartItems, subTotal, total, count });
    });
  },
  

 /* POST ADD To Cart Page */
 addToCart: (req, res) => {
  cartHelper.addToCart(req.params.id, req.session.user._id)
      .then((response) => {
          console.log(response,'res');
          res.send(response)
      })
},

 /* POST Update cart quantity Page */
 updateQuantity: (req, res) => {
    let userId = req.session.user._id
    cartHelper.updateQuantity(req.body).then(async (response) => {
    response.total = await orderHelper.totalCheckOutAmount(userId)
    response.subTotal = await orderHelper.getSubTotal(userId)
        res.json(response)
    })
},

/* Delete product from cart*/
deleteProduct: (req, res) => {
    console.log('came here');
    console.log(req.body,'lol');
    cartHelper.deleteProduct(req.body).then((response) => {
        res.send(response)
    })
}

  
}