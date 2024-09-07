const express = require("express");
var cors = require("cors");
const AppError = require("./utils/appError");
const fileupload = require("express-fileupload");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
// app.use(require('helmet')())
const limiter = require("express-rate-limit")({
  max: 1000,
  windowMs: 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use(
  cors({
    origin: "*",
  })
);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Manager",
      version: "1.0.0",
      description: "Library Manager API",
      contact: {
        name: "Babageldi Hudaynazarov",
        email: "hudaynazarovbabageldi1@gmail.com",
      },
    },

    servers: [
      {
        url: "http://localhost:5019",
      },
    ],
  },
  apis: ["./docs/*.yaml"],
};
const specs = swaggerJsDoc(options);
app.use(require("morgan")("dev"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// app.use('/', limiter);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/static`));
app.use(fileupload());
app.use("/api/admin", require("./routes/admin/adminRouter"));
app.get("/api/:image", (req, res) => {
  res.sendFile(req.params.image, { root: "./static" });
});
// app.use(timeout("120s"))
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(require("./controllers/errorController"));

module.exports = app;
