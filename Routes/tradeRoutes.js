const router = require("express").Router();
const tradeCtrl = require("../Controller/tradeCtrl");

router.post("/trade", tradeCtrl.trade);
router.get("/getPropTrade/:propId", tradeCtrl.getTradeByPropId);
router.get("/getChartData/:propId", tradeCtrl.getChartData);

module.exports = router;
