const fs = require('fs');
const { Document } = require('docx');
const mammoth = require('mammoth');

const filePath = process.argv[2] || './Ke Hoach Mon Nho.docx';

mammoth.extractRawText({ path: filePath })
  .then(result => {
    console.log(result.value);
  })
  .catch(err => {
    console.error('Error:', err);
  });
