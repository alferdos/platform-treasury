const router = require("express").Router();
const propertyCtrl = require("../Controller/propertyCtrl");

router.post("/create_property", propertyCtrl.createProperty);
router.post("/update_property", propertyCtrl.updateProperty);

router.post("/upload", propertyCtrl.upload);
router.post("/uploadPropertyImages", propertyCtrl.uploadPropertyImages);

router.get("/get_property", propertyCtrl.getProperty);
router.get("/get_property/:id", propertyCtrl.getPropertyById);
router.post("/delete_property", propertyCtrl.deleteProperty);
router.post("/updatePropertyFile", propertyCtrl.updatePropertyFile);
router.post("/changeData", propertyCtrl.changeData);

module.exports = router;
 