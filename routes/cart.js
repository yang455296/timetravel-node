const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// CUD要，不要R，要登入

router.use((req, res, next) => {
  // if(req.session.admin && req.session.admin.account){
  //     next();
  // } else {
  //     res.status(403).send('請先登入');
  // }
  next();
});

// 列表CRUD+細節CRUD

//總訂單的C
router.post("/api/makeorder", async (req, res) => {
  //訂單本身的C
  if (req.body.order) {
    const output = {
      success: false,
      code: 0,
      error: {},
      postData: req.body, //除錯用
    };
    const sql =
      "INSERT INTO `orders`(`member_sid`, `uuid`,`orders_total_price`, `orders_created_time`, `orders_status_sid`) VALUES (?, ?, ?, NOW(),2)";
    const [result] = await db.query(sql, [
      req.body.order.member_sid,
      req.body.order.uuid,
      req.body.order.orders_total_price,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
  }
  //美食的C
  if (req.body.food) {
    req.body.food.forEach(async (element) => {
      let output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, //除錯用
      };
      const sql =
        "INSERT INTO `orders_details_food`(`orders_uuid`, `food_products_sid`, `quantity`, `total_price`) VALUES (?, ?, ?,?)";
      const [result] = await db.query(sql, [
        element.uuid,
        element.id,
        element.quantity,
        element.price * element.quantity,
      ]);

      // if (result.affectedRows) output.success = true;
      // res.json(output);
    });
  }

  // 住宿的C;
  if (req.body.hotel) {
    req.body.hotel.forEach(async (element) => {
      const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, //除錯用
      };
      const sql =
        "INSERT INTO `orders_details_hotel`(`orders_uuid`, `hotel_products_sid`, `room_type`, `quantity`,`rep_name`,`rep_mobile`,`checkin_time`,`checkout_time`,`total_price`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [result] = await db.query(sql, [
        element.uuid,
        element.id,
        element.type,
        element.quantity,
        element.repName,
        element.repMobile,
        element.checkin,
        element.checkout,
        element.price * element.quantity,
      ]);
    });
  }

  // 票券的C;
  if (req.body.ticket) {
    req.body.ticket.forEach(async (element) => {
      const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, //除錯用
      };
      const sql =
        "INSERT INTO `orders_details_ticket`(`orders_uuid`, `ticket_products_sid`, `ticket_type`,`use_day`,`quantity`, `total_price`) VALUES (?, ?, ?, ?, ?, ?)";
      const [result] = await db.query(sql, [
        element.uuid,
        element.id,
        element.type,
        element.usedate,
        element.quantity,
        element.price,
      ]);
    });
  }
});


module.exports = router;

// //美食訂單的C
// router.post("/api/makefoodorder", async (req, res) => {
// res.json(req.body);
//   const output = {
//     success: false,
//     code: 0,
//     error: {},
//     postData: req.body, //除錯用
//   };
//   const sql =
//     "INSERT INTO `orders_details_food`(`orders_uuid`, `food_products_sid`, `quantity`, `total_price`) VALUES (?, ?, ?,?)";
//   const [result] = await db.query(sql, [
//     req.body.orders_uuid,
//     req.body.food_products_sid,
//     req.body.quantity,
//     req.body.total_price,
//   ]);

//   if (result.affectedRows) output.success = true;
//   res.json(output);
// });

// //住宿訂單的C
// router.post("/api/makehotelorder", async (req, res) => {
//   // res.json(req.body);
//   const output = {
//     success: false,
//     code: 0,
//     error: {},
//     postData: req.body, //除錯用
//   };
//   const sql =
//     "INSERT INTO `orders_details_hotel`(`orders_uuid`, `hotel_products_sid`, `room_type`, `quantity`,`rep_name`,`rep_mobile`,`checkin_time`,`checkout_time`,`total_price`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   const [result] = await db.query(sql, [
//     req.body.orders_uuid,
//     req.body.hotel_products_sid,
//     req.body.room_type,
//     req.body.quantity,
//     req.body.rep_name,
//     req.body.rep_mobile,
//     req.body.checkin_time,
//     req.body.checkout_time,
//     req.body.total_price,
//   ]);

//   if (result.affectedRows) output.success = true;
//   res.json(output);
// });

// //票券訂單的C
// router.post("/api/maketicketorder", async (req, res) => {
//   // res.json(req.body);
//   const output = {
//     success: false,
//     code: 0,
//     error: {},
//     postData: req.body, //除錯用
//   };
//   const sql =
//     "INSERT INTO `orders_details_ticket`(`orders_uuid`, `ticket_products_sid`, `ticket_type`,`use_day`,`quantity`, `total_price`) VALUES (?, ?, ?, ?, ?, ?)";
//   const [result] = await db.query(sql, [
//     req.body.orders_uuid,
//     req.body.ticket_products_sid,
//     req.body.ticket_type,
//     req.body.use_day,
//     req.body.quantity,
//     req.body.total_price,
//   ]);

//   if (result.affectedRows) output.success = true;
//   res.json(output);
// });

// module.exports = router;
