/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute'); // Adjust the path as needed
const utilities = require('./utilities');
const path = require('path');


/* ***********************
 View Engine and Templates
 *************************/
 app.set("view engine", "ejs")
 app.use(expressLayouts)
 app.set("layout", "./layouts/layout") // not at views root
 app.use(express.static("public"));
 app.set('views', path.join(__dirname, 'views'));

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute);

// Sedan Vehicles Route
app.get("/sedan", async (req, res, next) => {
  try {
    // Sedan data
    const sedanData = [
      { name: 'Mechanic Special', price: 100, image: '/images/vehicles/mechanic.jpg' },
      { name: 'Ford Model T', price: 30000, image: '/images/vehicles/model-t.jpg' },
      { name: 'Ford Crown Victoria', price: 10000, image: '/images/vehicles/crwn-vic.jpg' },
    ];
    let nav = await utilities.getNav(); // Assuming utilities.getNav() generates navigation dynamically
    res.render("sedan", {
      title: "Sedan Vehicles",
      sedans: sedanData,
      nav, // Pass the navigation menu to the view
      styles: "/css/vdetailstyles.css"
    });
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


