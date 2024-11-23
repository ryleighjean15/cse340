// // Needed Resources 
// const express = require("express")
// const router = new express.Router() 
// const invController = require("../controllers/invController")
// // Route to build inventory by classification view
// router.get("/type/:classificationId", invController.buildByClassificationId);

// router.get("/detail/:invId", invController.showVehicleDetail);

// module.exports = router;

const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Inventory home page');
});

module.exports = router; // Ensure this is correctly exported
