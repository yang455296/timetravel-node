require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const cors = require("cors");

const db = require(__dirname + "/modules/db_connect2");
const sessionStore = new MysqlStore({}, db);
const upload = require(__dirname + "/modules/upload-img");
const fs = require("fs").promises;

const app = express();

// top-level middleware 中介軟體--------------------------------------------------

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log({ origin });
    callback(null, true);
  },
};
app.use(cors(corsOptions));

app.use(session({
    saveUninitialized: false,  // 新用戶沒有使用到 session 物件時不會建立 session 和發送 cookie
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

// app.use("/cart", require(__dirname + "/routes/cart"));

// app.use("/member", require(__dirname + "/routes/member"));

// app.use("/food", require(__dirname + "/routes/food"));

app.use("/itinerary", require(__dirname + "/routes/itinerary"));

app.use("/site", require(__dirname + "/routes/site"));

// app.use("/stays", require(__dirname + "/routes/stays"));

// app.use("/ticket", require(__dirname + "/routes/ticket"));

app.post("/upload", upload.single("avatar"), async (req, res) => {
  res.json(req.file);
});

const myMiddle = (req, res, next) => {
  res.locals = { ...res.local, node: "經過middleware"};
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
