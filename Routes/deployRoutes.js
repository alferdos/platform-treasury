const router = require("express").Router();
const deployCtrl = require("../Controller/deployCtrl");

//Route url to deploy contract.
router.post("/deploy", deployCtrl.deploy);
router.get("/getPropBlockchainData/:propId", deployCtrl.getBlockchainDataByPropId);

module.exports = router;
