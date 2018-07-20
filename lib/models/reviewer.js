const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        require: true
    },
    company: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reviewer', schema);