const router = require("express").Router();
const transactionCtrl = require("../Controller/transactionCtrl");

//Route url to login user.
router.post("/buy", transactionCtrl.buy);
router.post("/sell", transactionCtrl.sell);
router.get("/allTransaction", transactionCtrl.allTransaction);
router.get("/getPropTransaction/:propId", transactionCtrl.getTransactionByPropId);
router.get("/getUserTransaction/:userId", transactionCtrl.getTransactionByUserId);
router.get("/getUserBalance/:userId", transactionCtrl.getBalanceByUserId);

module.exports = router;