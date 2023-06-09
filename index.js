const express = require("express");
const morgan = require("morgan");
const cors = require('cors')

const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
morgan.token('data-sent', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data-sent '));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

const generateId = () => {
  return Math.floor(Math.random()*10000000000);
}

app.post('/api/persons', (req, res) => {
  const {name, number} = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if (persons.find(person => person.name === name)) {
    return res.status(409).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    ...req.body
  }
  persons.push(newPerson);
  res.json(newPerson);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = persons.find(person => person.id === id);
  if (!result) {
    return res.status(404).end();
  }
  res.json(result);
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
})

app.get('/api/info', (req, res) => {
  res.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <br/>
      <p>${new Date()}</p>
    </div>
  `);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
  console.log("Server running on port " + PORT);
})