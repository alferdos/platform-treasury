const router = require("express").Router();
const adminController = require("../Controller/admin/adminCtrl");

//Route url to login user.
router.post("/admin/login", adminController.login);
router.post("/admin/logout", adminController.logout);
router.post("/admin/refresh_token", adminController.refreshToken);

module.exports = router;
