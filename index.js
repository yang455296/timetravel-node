require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const db = require(__dirname + "/modules/db_connect2");
const sessionStore = new MysqlStore({}, db);
const upload = require(__dirname + "/modules/upload-img");
const fs = require("fs").promises;

const app = express();

// enable files upload
// 啟動檔案上傳
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// 加入其它的middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//讓uploads目錄公開
// https://expressjs.com/zh-tw/starter/static-files.html
//app.use(express.static('uploads'));
// 如果想要改網址路徑用下面的
// 您可以透過 /static 路徑字首，來載入 uploads 目錄中的檔案。
app.use("/uploads", express.static("uploads"));

// 單檔上傳測試
/*--------------------------*/
app.post("/upload-avatar", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //使用輸入框的名稱來獲取上傳檔案 (例如 "avatar")
      let avatar = req.files.avatar;

      //使用 mv() 方法來移動上傳檔案到要放置的目錄裡 (例如 "uploads")
      avatar.mv("./uploads/" + avatar.name);

      //送出回應
      res.json({
        status: true,
        message: "File is uploaded",
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
/*--------------------------*/

// 多檔上傳測試
/*--------------------------*/
app.post("/upload-photos", async (req, res) => {
  try {
    if (!req.files) {
      res.json({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let data = [];

      //loop all files
      _.forEach(_.keysIn(req.files.photos), (key) => {
        let photo = req.files.photos[key];

        //move photo to uploads directory
        photo.mv("./uploads/" + photo.name);

        //push file details
        data.push({
          name: photo.name,
          mimetype: photo.mimetype,
          size: photo.size,
        });
      });

      //return response
      res.json({
        status: true,
        message: "Files are uploaded",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
/*--------------------------*/

// top-level middleware 中介軟體--------------------------------------------------

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log({ origin });
    callback(null, true);
  },
};
app.use(cors(corsOptions));

app.use(
  session({
    saveUninitialized: false, // 新用戶沒有使用到 session 物件時不會建立 session 和發送 cookie
    resave: false, // 沒變更內容是否強制回存
    secret: "TimeTravel", //亂碼隨意給
    store: sessionStore,
    cookie: {
      maxAge: 1_800_000, //30min
    },
  })
);

// urlencoded+post處理表單
app.use(express.urlencoded({ extended: false })); //Content-Type: urlencoded才會使用
app.use(express.json()); //Content-Type: json才會使用

app.use(async (req, res, next) => {
  //自己定義的 template helper function
  res.locals.title = "TimeTravel";
  res.locals.session = req.session;

  res.locals.auth = {}; // 預設值
  let auth = req.get("Authorization");

  if (auth && auth.indexOf("Bearer ") === 0) {
    auth = auth.slice(7);
    try {
      const payload = await jwt.verify(auth, process.env.JWT_SECRET);
      res.locals.auth = payload;
    } catch (ex) {}
  }
  next();
});

// routes --------------------------------------------------

app.get("/", (req, res) => {
  res.send("<h1>TimeTravel Node</h1>");
});

app.use("/cart", require(__dirname + "/routes/cart"));

app.use("/orders", require(__dirname + "/routes/orders"));

app.use("/comment", require(__dirname + "/routes/comment"));

app.use("/pay", require(__dirname + "/routes/pay"));

app.use("/member", require(__dirname + "/routes/member"));

app.use("/food", require(__dirname + "/routes/food"));

app.use("/itinerary", require(__dirname + "/routes/itinerary"));

app.use("/site", require(__dirname + "/routes/site"));

app.use("/hotel", require(__dirname + "/routes/hotel"));

app.use("/ticket", require(__dirname + "/routes/ticket"));

app.use("/productAll", require(__dirname + "/routes/productAll"));

app.post("/upload", upload.single("avatar"), async (req, res) => {
  res.json(req.file);
});

const myMiddle = (req, res, next) => {
  res.locals = { ...res.local, node: "經過middleware" };
  next();
}; // req, res會往下傳遞
app.get("/middle", [myMiddle], (req, res) => {
  res.json(res.locals);
});

// 靜態資料夾設定--------------------------------------------------
// 照片放react，/public/uploads 放上傳照片
app.use(express.static("public"));

// --------------------------------------------------
app.use((req, res) => {
  res.status(404).send("<h3>找不到你要的頁面，請檢查路由是否正確</h3>");
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
  console.log(`server started, port: ${port}`);
});
