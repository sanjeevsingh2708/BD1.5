const express = require('express');
const { resolve } = require('path');

const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

// Server-side Values
let taxRate = 5; //5%
let discountPercentage = 10; //10%
let loyaltyRate = 2; // 2 points per $1

//=========================================== Calculate the total price of items in the cart

function getTotalCartValue(newItemPrice, cartTotal) {
  return newItemPrice + cartTotal;
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = req.query.newItemPrice;
  let cartTotal = req.query.cartTotal;
  res.send(getTotalCartValue(newItemPrice, cartTotal).toString());
});

//============================================ Apply a discount based on membership status

function getTotlaCartValue(cartTotal, isMember) {
  if (isMember) {
    cartTotal = cartTotal - (cartTotal * discountPercentage) / 100;
  }
  return cartTotal;
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseInt(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  res.send(getTotlaCartValue(cartTotal, isMember).toString());
});

//========================================== Calculate tax on the cart total

function getTaxValue(cartTotal) {
  return (cartTotal * taxRate) / 100;
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseInt(req.query.cartTotal);
  res.send(getTaxValue(cartTotal).toString());
});
//==========================================  Estimate delivery time based on shipping method

function getDeliveryTime(shippingMethod, distance) {
  let estimatedDelTime;
  if (shippingMethod == 'Standard') {
    estimatedDelTime = distance / 50;
  } else {
    estimatedDelTime = distance / 100;
  }
  return estimatedDelTime;
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseInt(req.query.distance);

  res.send(getDeliveryTime(shippingMethod, distance).toString());
});

//=======================================  Calculate the shipping cost based on weight and distance

function getShippingCost(weight, distance) {
  return weight * distance * 0.1;
}

app.get('/shipping-cost', (req, res) => {
  let weight = parseInt(req.query.weight);
  let distance = parseInt(req.query.distance);
  res.send(getShippingCost(weight, distance).toString());
});

//=======================================  Calculate loyalty points earned from a purchase

function getLoyaltyPoints(purchaseAmount) {
  return purchaseAmount * loyaltyRate;
}

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseInt(req.query.purchaseAmount);

  res.send(getLoyaltyPoints(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
