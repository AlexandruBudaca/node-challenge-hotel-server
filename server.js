const express = require("express");
const cors = require("cors");
const moment = require("moment");
const dotenv = require("dotenv");
const app = express();
const mongodb = require("mongodb");

app.use(express.json());
app.use(cors());
dotenv.config();
const uri = process.env.DATABASE_URI;
const client = new mongodb.MongoClient(uri);

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings.");
});

app.get("/bookings", (req, res) => {
  client.connect(() => {
    const db = client.db("hotel");
    const collection = db.collection("bookings");
    collection.find().toArray((err, booking) => {
      err ? res.sendStatus(404).send("Bookings not found!") : res.send(booking);
    });
  });
});

app.post("/bookings", (req, res) => {
  client.connect(() => {
    const db = client.db("hotel");
    const collection = db.collection("bookings");

    const {
      title,
      firstName,
      surname,
      email,
      roomId,
      checkInDate,
      checkOutDate,
    } = req.body;

    const newBooking = {
      title: title,
      firstName: firstName,
      surname: surname,
      email: email,
      roomId: Number(roomId),
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    };

    if (
      newBooking.title &&
      newBooking.title === "" &&
      newBooking.firstName &&
      newBooking.firstName === "" &&
      newBooking.surname &&
      newBooking.surname === "" &&
      newBooking.email &&
      newBooking.email === "" &&
      newBooking.roomId &&
      newBooking.roomId === "" &&
      newBooking.checkInDate &&
      newBooking.checkInDate === "" &&
      newBooking.checkOutDate &&
      newBooking.checkOutDate === ""
    ) {
      res.sendStatus(400);
    }

    collection.insertOne(newBooking, (err, booking) => {
      if (err) {
        res.send({ message: "failed to post" });
      } else {
        res.send({ message: "successful" });
      }
    });
  });
});

app.get("/bookings/search", (req, res) => {
  client.connect(() => {
    const db = client.db("hotel");
    const collection = db.collection("bookings");
    collection.find().toArray((err, booking) => {
      err
        ? res.sendStatus(404).send({ message: "Bookings not found!" })
        : res.send(booking);
    });
  });
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

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
