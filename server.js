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
      if (err) {
        res.send({ message: "Not found" });
      } else {
        res.send(booking);
      }
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

app.get("/bookings/search/:text", (req, res) => {
  client.connect(() => {
    const db = client.db("hotel");
    const collection = db.collection("bookings");

    const textTerm = req.params.text;
    collection
      .find({
        $or: [
          { firstName: { $regex: `${textTerm}`, $options: "i" } },
          { surname: { $regex: `${textTerm}`, $options: "i" } },
        ],
      })
      .toArray((err, booking) => {
        if (err) {
          res.send({ message: "Not found" });
        } else {
          res.send(booking);
        }
      });
  });
});

app.delete("/bookings/:id", (req, res) => {
  client.connect(() => {
    const db = client.db("hotel");
    const collection = db.collection("bookings");

    let id;
    try {
      id = new mongodb.ObjectID(req.params.id);
    } catch (error) {
      res.sendStatus(400);
      return;
    }
    const searchBookingId = { _id: id };

    collection.deleteOne(searchBookingId, (err, booking) => {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Message deleted successfully!" });
      }
    });
  });
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
