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



/* ***********************
 View Engine and Templates
 *************************/
 app.set("view engine", "ejs")
 app.use(expressLayouts)
 app.set("layout", "./layouts/layout") // not at views root
 app.use(express.static('public'));

/* ***********************
 * Routes
 *************************/
app.use(static)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.get('/', (req, res) => res.render('home', { title: 'Home - CSE Motors' }));
app.get('/custom', (req, res) => res.render('custom', { title: 'Custom - CSE Motors' }));
app.get('/sedan', async (req, res) => {
  // Sample sedan vehicle data
  const sedanVehicles = [
    { id: 1, name: "Mechanic Special", price: "$100", image: "/images/mechanic.jpg" },
    { id: 2, name: "Ford Model T", price: "$30,000", image: "/images/model-t.jpg" },
    { id: 3, name: "Ford Crown Victoria", price: "$10,000", image: "/images/crwn-vic.jpg" }
  ];

  try {
    // Assuming utilities.getNav() fetches your nav links
    const nav = await utilities.getNav();
    res.render('sedan', {
      title: 'Sedan Vehicles - CSE Motors',
      nav,                // Pass navigation links
      vehicles: sedanVehicles // Pass vehicle data to the EJS template
    });
  } catch (error) {
    console.error(`Error loading sedan page: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/suv', (req, res) => res.render('suv', { title: 'SUV - CSE Motors' }));
app.get('/truck', (req, res) => res.render('truck', { title: 'Truck - CSE Motors' }));

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


