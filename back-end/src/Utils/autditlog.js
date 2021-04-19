var que = [];
const fs = require("fs");

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

setInterval(writer, 1000);

module.exports = { writer, queadder };
