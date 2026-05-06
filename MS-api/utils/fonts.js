const fs = require('fs');
const path = require('path');

// قراءة الخطوط كـ base64
const fontRegular = fs.readFileSync(
  path.join(__dirname, '../fonts/Almarai-Regular.ttf')
).toString('base64');
const fontBold = fs.readFileSync(
  path.join(__dirname, '../fonts/Almarai-Bold.ttf')
).toString('base64');

// vfs (ربط اسم الملف بمحتواه)
const vfs = {
  'Almarai-Regular.ttf': fontRegular,
  'Almarai-Bold.ttf': fontBold,
};

// تعريف العائلات التي ستُستخدم في docDefinition
const fonts = {
  Almarai: {
    normal: 'Almarai-Regular.ttf',
    bold: 'Almarai-Bold.ttf',
  }
};

module.exports = { vfs, fonts };