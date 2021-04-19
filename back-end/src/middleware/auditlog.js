const auditlog = require("../Utils/autditlog");

const a = (req, res, next) => {
  try {
    auditlog.queadder({
      name: req.user.name,
      email: req.user.email,
      path: req.originalUrl,
      body: req.body,
      timestamp: new Date(),
    });
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = a;
