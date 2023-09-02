const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => {
        console.log('connection to MongoDB successful');
    }).catch(error => {
        console.log('unable to connect to MongoDB', error);
    });

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: "Phone number start with 2 or 3 digits, followed by hyphen, then any number of digits"
        }
    },
});

mongoose.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString();
        delete returnObject._id;
        delete returnObject.__v;
    }
})
module.exports = mongoose.model('person', personSchema);