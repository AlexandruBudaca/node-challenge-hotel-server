const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: Number(req.body.roomId),
    checkInDate: moment(req.body.checkInDate),
    checkOutDate: moment(req.body.checkOutDate),
  };
  bookings.push(newBooking);
  res.send(bookings);
});
