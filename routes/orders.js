const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

//取得會員資料
// router.get(["/api/memberlist"], async (req, res) => {
//   const [rows] = await db.query("SELECT * FROM `member_information` WHERE 1");
//   res.json(rows);
//   //不做分頁
// });
//取得訂單資料
router.get(["/api/list/:member_sid"], async (req, res) => {
  const [rows] = await db.query(
    "SELECT `orders_created_time`,`uuid`,`orders_total_price`,`orders`.`orders_status_sid` FROM `orders` JOIN `member_information` ON `orders`.`member_sid`=`member_information`.`sid` WHERE `member_information`.`sid`=?",
    [req.params.member_sid]
  );
  res.json(rows);
});
router.get(["/api/list/foodlist/:order_uuid"], async (req, res) => {
  const [rows] = await db.query(
    "SELECT `product_name`,`p_selling_price`,`product_number`,`orders_details_food`.`quantity`,`orders_details_food`.`total_price`,`orders_details_food`.`commented` FROM `food_product_all` JOIN `orders_details_food` JOIN `orders` ON `food_product_all`.`sid`=`orders_details_food`.`food_products_sid` AND `orders_details_food`.`orders_uuid`=`orders`.`uuid` WHERE `orders`.`uuid`=?",
    [req.params.order_uuid]
  );
  res.json(rows);
  //不做分頁
}); //單筆資料http://localhost:3001/site/item/12
router.get(["/api/list/hotellist/:order_uuid"], async (req, res) => {
  const [rows] = await db.query(
    "SELECT `product_name`,`orders_details_hotel`.`quantity`,`orders_details_hotel`.`total_price`,`hotel_room`.`room_price`,`orders_details_hotel`.`committed`  FROM `hotel`JOIN `orders_details_hotel` JOIN `hotel_room` JOIN `orders` ON `orders`.`uuid`=`orders_details_hotel`.`orders_uuid` AND `orders_details_hotel`.`hotel_products_sid`=`hotel`.`sid` AND `hotel_room`.`product_number`=`hotel`.`product_number` AND `orders_details_hotel`.`room_type`=`hotel_room`.`room_type` WHERE `orders`.`uuid`=?",
    [req.params.order_uuid]
  );
  res.json(rows);
  //不做分頁
}); //單筆資料http://localhost:3001/site/item/12
router.get(["/api/list/ticketlist/:order_uuid"], async (req, res) => {
  const [rows] = await db.query(
    "SELECT `product_name`,`p_selling_price`,`orders_details_food`.`quantity`,`orders_details_food`.`total_price`,`orders_details_food`.`committed` FROM `food_product_all` JOIN `orders_details_food` JOIN `orders` ON `food_product_all`.`sid`=`orders_details_food`.`food_products_sid` AND `orders_details_food`.`orders_uuid`=`orders`.`uuid` WHERE `orders`.`uuid`=?",
    [req.params.order_uuid]
  );
  res.json(rows);
  //不做分頁
}); //單筆資料http://localhost:3001/site/item/12

module.exports = router;
