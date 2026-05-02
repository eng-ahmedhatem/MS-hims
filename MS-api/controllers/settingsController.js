const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  const { institutionName } = req.body;
  let settings = await Settings.findOne();
  if (settings) {
    settings.institutionName = institutionName || settings.institutionName;
    await settings.save();
  } else {
    settings = await Settings.create({ institutionName });
  }
  res.json(settings);
};