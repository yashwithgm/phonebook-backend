require('dotenv').config();

const express = require('express');
const Person = require('./models/person');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.static('dist'));
app.use(express.json());

morgan.token('response', function (req, res) {
    return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'))

function generateId() {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => person.id))
        : 0;

    return maxId + 1;
}
app.get("/api/persons", (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        });
});

app.get("/api/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>

        <p>${new Date().toString()}</p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person);
        })
});

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'no name and number provided'
        });
    }

    // if (persons.map(person => person.name).includes(body.name)) {
    //     return response.status(400).json({
    //         error: `${body.name} already exists in the phonebook`
    //     });
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const unkonwnEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpont'
    });
}

app.use(unkonwnEndpoint);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
});
