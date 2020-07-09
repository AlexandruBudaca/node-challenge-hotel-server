const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings.");
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
  const newBookingKeys = Object.keys(newBooking);
  const checkKeys = newBookingKeysupd.every((key) =>
    newBooking.hasOwnProperty(key)
  );
  checkKeys ? bookings.push(newBooking) : res.sendStatus(400);
  res.json(bookings);
});
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const findBooking = bookings.find((booking) => booking.id === bookingId);
  findBooking ? res.json(findBooking) : res.sendStatus(400);
});
app.delete("/bookings/:id", (req, res) => {
  const delBookingId = Number(req.params.id);
  const findBooking = bookings.find((booking) => booking.id === delBookingId);
  if (findBooking) {
    const filterBookings = bookings.filter(
      (booking) => booking.id !== findBooking.id
    );
    res.json(filterBookings);
  }
  res.sendStatus(400);
});
