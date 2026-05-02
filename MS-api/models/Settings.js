const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  institutionName: { type: String, default: 'مؤسسة' }
});

module.exports = mongoose.model('Settings', settingsSchema);