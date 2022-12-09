const crypto = require("crypto-js");
const SHA256 = require("crypto-js/sha256");
let MerchantID = 3002599;
let MerchantTradeNo = "ECPAY237892173123";
let MerchantTradeDate = "2022/12/07 01:02:52";
let PaymentType = "aio";
let TradeDesc = "TimeTravel";
let ItemName = "TimeTravel";
let ReturnURL = "http://localhost:3000/cart/success";
let ChoosePayment = "Credit";
let EncryptType = 1;
let HashKey = "spPjZn66i0OhqJsQ";
let HashIV = "hT5OJckN45isQTTs";
let TotalAmount = 1000;
// let CheckMacValue = `HashKey=${HashKey}&ChoosePayment=${ChoosePayment}&EncryptType=${EncryptType}&ItemName=${ItemName}&MerchantID=${MerchantID}&MerchantTradeDate=${MerchantTradeDate}&MerchantTradeNo=${MerchantTradeNo}&PaymentType=${PaymentType}&ReturnURL=${ReturnURL}&TotalAmount=${TotalAmount}&TradeDesc=${TradeDesc}&HashIV=${HashIV}`;
let CheckMacValue = `HashKey=${HashKey}&ChoosePayment=${ChoosePayment}&EncryptType=${EncryptType}&ItemName=${ItemName}&MerchantID=${MerchantID}&MerchantTradeDate=${MerchantTradeDate}&MerchantTradeNo=${MerchantTradeNo}&PaymentType=${PaymentType}&ReturnURL=${ReturnURL}&TotalAmount=${TotalAmount}&TradeDesc=${TradeDesc}&HashIV=${HashIV}`;

const encoded = encodeURIComponent(CheckMacValue);
const low = encoded.toLowerCase();
const net = low.replace("%20", "+");
const encrypto = SHA256(net).toString();

const upper = encrypto.toUpperCase();
console.log("result= " + upper);
