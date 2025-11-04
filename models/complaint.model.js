const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  complain: { type: String, required: true },
  image: { type: String, required: false },  // Store the image filename or path
  image_address: { type: String, required: false },
  status: { type: String, default: 'pending' }  // Store the address where image was uploaded from
});

const Complain = mongoose.model('Complain', complainSchema);
module.exports = Complain;
