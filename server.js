const express = require("express");
const cors = require("cors");

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

app.get("/bookings", (req, res) => {
  res.json(bookings);
});
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: Math.floor(
      Math.random() * Math.floor(bookings.length + 100),
      bookings.length
    ),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: Number(req.body.roomId),
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  bookings.push(newBooking);
  res.send(bookings);
});
app.get("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const findBooking = bookings.find((booking) => booking.id === bookingId);
  res.send(findBooking);
});
