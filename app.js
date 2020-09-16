const express = require("express");
const keys = require("./config/keys");

const stripe = require("stripe")(keys.stripeSecretKey);

const bodyParser = require("body-parser");
const expressHandleBars = require("express-handlebars");

const app = express();

//handlebars middlewares here
app.engine("handlebars", expressHandleBars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
//app.use(express.static(`${__dirname}/public`));

//routes
app.get("/", (req, res) => {
  //render template
  res.render("index", {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

//payment route
app.post("/charge", (req, res) => {
  const amount = 500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Algo Expert",
        currency: "usd",
        customer: customer.id,

        shipping: {
          name: "test",
          address: {
            line1: "test",
            postal_code: "98140",
            city: "test",
            state: "test",
            country: "US",
          },
        },
      }),
    )
    .then((charge) => res.render("success"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
