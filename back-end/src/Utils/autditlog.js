const fs = require("fs");
const path = require("path");

var que = [];

const queadder = (a) => {
  que.push(a);
};

const writer = () => {
  que.forEach((element) => {
    const data = que.pop();

    fs.appendFile(process.env.file, JSON.stringify(data), function (err) {
      if (err) throw err;
    });
  });
};

const setuplogs = (a) => {
  fs.mkdirSync(path.join(__dirname, "/Utils/"), { recursive: true });
};

setInterval(writer, 1000);

module.exports = { writer, queadder, setuplogs };
