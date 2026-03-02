const router = require("express").Router();
const requestFundCtrl = require("../Controller/requestFundCtrl");

router.post("/requestFund", requestFundCtrl.requestFund);
router.get("/getRequestFund", requestFundCtrl.getRequestFund);
router.post("/approveRequest", requestFundCtrl.approveRequest);

module.exports = router;
