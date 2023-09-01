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
    name: String,
    number: String
});

mongoose.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString();
        delete returnObject._id;
        delete returnObject.__v;
    }
})
module.exports = mongoose.model('person', personSchema);