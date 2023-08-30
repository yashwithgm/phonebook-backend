const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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
];

const app = express();

// const corsObject = {
//     orgin: 'http://localhost:3000'
// };

// app.use(cors(corsObject));

app.use(express.static('dist'));
app.use(express.json());

// function requestLogger(request, reponse, next) {
//     console.log(`Method: ${request.method}`);
//     console.log(`Path: ${request.path}`);
//     console.log(`Body: ${request.body}`);
//     next();
// }

// app.use(requestLogger);

// app.use(morgan('tiny'));
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
    response.json(persons);
});

app.get("/api/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>

        <p>${new Date().toString()}</p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find(person => person.id === id);

    if (!person) {
        return response.status(404).end();
    }
    response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'no name and number provided'
        });
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: `${body.name} already exists in the phonebook`
        });
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId,
    };

    persons = persons.concat(person);
    response.json(person);
});

const unkonwnEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpont'
    });
}

app.use(unkonwnEndpoint);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
});
