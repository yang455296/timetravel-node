const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto-js");

const uuid = 1670346171015;
//req.params.order_uuid
router.get(["/api/paylist/:order_uuid"], async (req, res) => {
  const [ordersData] = await db.query(
    "SELECT `uuid`,`payment_id`,`orders_total_price` FROM `orders` WHERE uuid=?",
    [uuid]
  );

  const [hotelDetailData] = await db.query(
    "SELECT `product_name`,`orders_details_hotel`.`total_price` FROM `hotel` JOIN `orders_details_hotel`JOIN `orders` ON `orders`.`uuid`=`orders_details_hotel`.`orders_uuid` AND `orders_details_hotel`.`hotel_products_sid`=`hotel`.`sid` WHERE `orders`.`uuid`=?",
    [uuid]
  );
  const [foodDetailData] = await db.query(
    "SELECT `product_name`,`p_selling_price`,`orders_details_food`.`quantity` FROM `food_product_all` JOIN `orders_details_food` JOIN `orders` ON `orders`.`uuid`=`orders_details_food`.`orders_uuid` AND `orders_details_food`.`food_products_sid`=`food_product_all`.`sid` WHERE `orders`.`uuid`=?",
    [uuid]
  );
  const [ticketDetailData] = await db.query(
    "SELECT `product_name`,`ticket_price`,`orders_details_ticket`.`quantity` FROM `tickets` JOIN `orders_details_ticket` JOIN `orders` ON `orders`.`uuid`=`orders_details_ticket`.`orders_uuid` AND `orders_details_ticket`.`ticket_products_sid`=`tickets`.`sid` WHERE `orders`.`uuid`=?",
    [uuid]
  );
  // const newArr = [
  //   ordersDat,
  //   hotelDetailData,
  //   foodDetailData,
  //   ticketDetailData,
  // ];
  res.json(ordersData);
});
module.exports = router;

//TODO:根據指定的訂單編號，獲取以下資訊
//付款金額：orders.orders_total_price
//訂單編號：orders.uuid
//付款編號：orders.payment_id
//商品細項：[{住宿商品名,住宿商品數量,住宿商品單價},{美食商品名,美食商品數量,美食商品單價},{票券商品名,票券商品數量,票券商品單價}]

//TODO：如何將獲得的商品資訊，創成一個array？

// let key = "9410f055f865eaa384deb28daf224dc8";
// let nonce = uuidv4();
// let uri = "/v3/payments/request";
// let body = {
//   amount: 500, //付款金額：orders.orders_total_price=>orders_data[0].orders_total_price
//   currency: "TWD", //固定
//   orderId: "order20210921003", //訂單編號：orders.uuid=>orders_data[0].uuid
//   packages: [
//     {
//       id: "20210921003", //付款編號：orders.payment_id=>orders_data[0].payment_id
//       amount: 500, //付款金額，同上
//       products: [
//         //所有商品細項
//         {
//           name: "買不起的iphone", //商品名，ex：路境行旅
//           quantity: 1, //數量
//           price: 500, //單價
//         },
//       ],
//     },
//   ],
//   redirectUrls: {
//     confirmUrl: "http://localhost:3000/cart/success",
//     cancelUrl: "http://localhost:3000/cart/fail",
//   },
// };

// let encrypt = crypto.HmacSHA256(key + uri + JSON.stringify(body) + nonce, key);
// let hmacBase64 = crypto.enc.Base64.stringify(encrypt);

// let configs = {
//   headers: {
//     "Content-Type": "application/json",
//     "X-LINE-ChannelId": 1657710153,
//     "X-LINE-Authorization-Nonce": nonce,
//     "X-Line-Authorization": hmacBase64,
//   },
// };

// axios
//   .post("https://sandbox-api-pay.line.me/v3/payments/request", body, configs)
//   .then((res) => {
//     console.log(res.data);
//   });
