const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

//寫入評論
router.post("/api/submit-comment-api", async (req, res) => {
  //美食部分
  if (req.body.type === "food") {
    const output = {
      success: false,
      code: 0,
      error: {},
      postData: req.body, //除錯用
    };
    const sql =
      "INSERT INTO `commit_food`(`product_name`, `product_number`, `commit_text`, `userID`, `score`) VALUES (?,?,?,?,?)";
    const [result] = await db.query(sql, [
      req.body.product_name,
      req.body.product_number,
      req.body.commit_text,
      req.body.userID,
      req.body.score,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
  }
  if (req.body.type === "hotel") {
    const output = {
      success: false,
      code: 0,
      error: {},
      postData: req.body, //除錯用
    };
    const sql =
      "INSERT INTO `commit_hotel`(`product_name`, `product_number`, `commit_text`, `userID`, `score`) VALUES (?,?,?,?,?)";
    const [result] = await db.query(sql, [
      req.body.product_name,
      req.body.product_number,
      req.body.commit_text,
      req.body.userID,
      req.body.score,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
  }
  if (req.body.type === "ticket") {
    const output = {
      success: false,
      code: 0,
      error: {},
      postData: req.body, //除錯用
    };
    const sql =
      "INSERT INTO `commit_food`(`product_name`, `product_number`, `commit_text`, `userID`, `score`) VALUES (?,?,?,?,?)";
    const [result] = await db.query(sql, [
      req.body.product_name,
      req.body.product_number,
      req.body.commit_text,
      req.body.userID,
      req.body.score,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
  }
});

//更改訂單已評論狀態
router.put("/api/change-commented", async (req, res) => {
  if (req.body.type === "food") {
    const output = {
      success: false,
      code: 0,
      error: {},
      postData: req.body, //除錯用
    };
    console.log(req.body);
    const sql =
      "UPDATE `orders_details_food` JOIN `food_product_all` ON `food_product_all`.`sid`=`orders_details_food`.`food_products_sid` SET `commented`='1'  WHERE `orders_details_food`.`orders_uuid`=? AND `food_product_all`.`product_number`=?";
    const [result] = await db.query(sql, [
      req.body.uuid,
      req.body.product_number,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
  }
  if (req.body.type === "hotel") {
    const output = {
      success: false,
      code: 0,
      error: {},
      postData: req.body, //除錯用
    };
    console.log(req.body);
    const sql =
      "UPDATE `orders_details_hotel` JOIN `hotel` ON `hotel`.`sid`=`orders_details_hotel`.`hotel_products_sid` SET `commented`='1'  WHERE `orders_details_hotel`.`orders_uuid`=? AND `hotel`.`product_number`=?";
    const [result] = await db.query(sql, [
      req.body.uuid,
      req.body.product_number,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
  }
});

module.exports = router;
