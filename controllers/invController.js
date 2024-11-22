const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.showVehicleDetail = async function (req, res, next) {
  const invId = req.params.invId; // Get inventory ID from the URL
  try {
    // Fetch vehicle data by inventory ID
    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      return res.status(404).render('errors/error', { 
        title: 'Vehicle Not Found', 
        message: 'Sorry, this vehicle does not exist in our inventory.' 
      });
    }

    // Fetch the navigation HTML
    let nav = await utilities.getNav();

    // Render the detail view with the vehicle data
    res.render('inventory/vehicle-detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`, 
      nav,
      vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/error', {
      title: 'Server Error',
      message: 'There was a problem fetching the vehicle details. Please try again later.'
    });
  }
};

module.exports = invCont
