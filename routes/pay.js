const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto-js");

// const uuid = 1670387472990;
//req.params.order_uuid
let key;
let nonce;
router.get(["/api/paylist/:uuid"], async (req, res) => {
  let payUrl;
  const [rows] = await db.query(
    "SELECT `uuid`,`payment_id`,`orders_total_price` FROM `orders` WHERE uuid=?",
    [req.params.uuid]
  );

  key = "9410f055f865eaa384deb28daf224dc8";
  nonce = uuidv4();
  let uri = "/v3/payments/request";
  let body = {
    amount: rows[0].orders_total_price, //付款金額：orders.orders_total_price=>orders_data[0].orders_total_price
    currency: "TWD", //固定
    orderId: rows[0].uuid, //訂單編號：orders.uuid=>orders_data[0].uuid
    packages: [
      {
        id: rows[0].payment_id, //付款編號：orders.payment_id=>orders_data[0].payment_id
        amount: rows[0].orders_total_price, //付款金額，同上
        products: [
          //所有商品細項
          {
            name: "Time Travel", //商品名，ex：路境行旅
            quantity: 1, //數量
            price: rows[0].orders_total_price, //單價
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: `http://localhost:3000/cart/success?amount=${rows[0].orders_total_price}`,
      cancelUrl: "http://localhost:3000/cart/fail",
    },
  };

  let encrypt = crypto.HmacSHA256(
    key + uri + JSON.stringify(body) + nonce,
    key
  );
  let hmacBase64 = crypto.enc.Base64.stringify(encrypt);

  configs = {
    headers: {
      "Content-Type": "application/json",
      "X-LINE-ChannelId": 1657710153,
      "X-LINE-Authorization-Nonce": nonce,
      "X-Line-Authorization": hmacBase64,
    },
  };

  const res2 = await axios.post(
    "https://sandbox-api-pay.line.me/v3/payments/request",
    body,
    configs
  );

  payUrl = res2.data.info.paymentUrl.web;
  console.log(payUrl);
  res.json({ payUrl });
});

router.post(["/api/paycheck"], async (req, res) => {
  // console.log(req.body);
  let body = {
    amount: req.body.amount,
    currency: "TWD",
  };
  uri = `/v3/payments/${req.body.transactionId}/confirm`;
  let encrypt = crypto.HmacSHA256(
    key + uri + JSON.stringify(body) + nonce,
    key
  );
  let hmacBase64 = crypto.enc.Base64.stringify(encrypt);
  configs = {
    headers: {
      "Content-Type": "application/json",
      "X-LINE-ChannelId": 1657710153,
      "X-LINE-Authorization-Nonce": nonce,
      "X-Line-Authorization": hmacBase64,
    },
  };
  const res3 = await axios.post(
    `https://sandbox-api-pay.line.me/v3/payments/${req.body.transactionId}/confirm`,
    body,
    configs
  );
  console.log(res3.data.returnCode);
  const payResult = res3.data.returnCode;
  res.json({ payResult });
});
//更改訂單狀態
router.put("/api/change-pay", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: {},
    postData: req.body, //除錯用
  };
  console.log(req.body);
  const sql = "UPDATE `orders` SET `orders_status_sid`=1 WHERE `uuid`=?";
  const [result] = await db.query(sql, [req.body.orderId]);

  if (result.affectedRows) output.success = true;
  res.json(output);
});

module.exports = router;
