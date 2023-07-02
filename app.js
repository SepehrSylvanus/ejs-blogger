require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const connectDB = require("./server/config/db");
const app = express();
const PORT = 5000 || process.env.PORT;
const { isActiveRoute } = require("./server/helpers/routeHelpers");

// connect to db
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "e2910decbfb3606da94678bc3c204718",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);

app.use(express.static("public"));
// Templating engin
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.locals.isActiveRoute = isActiveRoute;
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
