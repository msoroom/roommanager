const createProxyMiddleware = require("http-proxy-middleware");
require("dotenv").config();

module.exports = function (app) {
  console.log(process.env.PROXY);
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.PROXY || "http://localhost:3001",
      changeOrigin: true,
    })
  );
};
