const { randomInt } = require("crypto");
const fs = require("fs");
const qr = require("qrcode");
const { PassThrough } = require("stream");
const sharp = require("sharp");

const names = fs.readFileSync("./src/Utils/fruits.txt").toString().split("\n");
const colors = fs.readFileSync("./src/Utils/colors.txt").toString().split("\n");

module.exports.genPassword = () => {
  var p1 = names[randomInt(names.length - 1)];
  p1 += randomInt(99);
  p1 += colors[randomInt(colors.length - 1)];

  return p1;
};

module.exports.genid = () => {
  const a = (Math.random() * 1_000_000_0).toFixed(0);
  var num = "0".repeat(7 - a.length) + a;
  return num;
};

module.exports.qrcode = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = new PassThrough();
      stream.setDefaultEncoding("base64");
      const chunks = [];
      const result = await qr.toFileStream(
        stream,
        url,

        {
          type: "png",
          width: 200,
          errorCorrectionLevel: "L",
        }
      );

      stream.on("data", (a) => chunks.push(a));

      return stream.on("end", async function () {
        var bus = await sharp(Buffer.concat(chunks))
          .resize({ width: 250, height: 250 })
          .png()
          .toBuffer();
        resolve(bus);
      });
    } catch (error) {
      console.log(error);
    }
  });
};
