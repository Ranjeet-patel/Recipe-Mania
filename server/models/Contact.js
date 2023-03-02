const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'This field is required.'
  },
  name: {
    type: String,
    required: 'This field is required.'
  },
  number: {
    type: Number,
    required: 'This field is required.'
  },
  subject: {
    type: String,
    required: 'This field is required.'
  },
  message: {
    type: String,
    required: 'This field is required.'
  },
});

module.exports = mongoose.model('Contact', contactSchema);