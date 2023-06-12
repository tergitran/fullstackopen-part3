require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

morgan.token("data-sent", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :data-sent "
  )
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    res.json(result);
  }).catch(error => {
    next(error);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { number } = req.body;
  Person.findByIdAndUpdate(req.params.id, { number }, { new: true, runValidators: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/info", (req, res) => {
  Person.countDocuments({}).then((length) => {
    res.send(`
    <div>
      <p>Phonebook has info for ${length} people</p>
      <br/>
      <p>${new Date()}</p>
    </div>
  `);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
