const mammoth = require('mammoth');
const fs = require('fs');

async function compareDocx() {
  try {
    const file1 = './ke_hoach_chi_tiet_mon_nho.docx';
    const file2 = './Ke Hoach Mon Nho.docx';
    
    console.log('='.repeat(80));
    console.log('FILE 1: ke_hoach_chi_tiet_mon_nho.docx');
    console.log('='.repeat(80));
    const result1 = await mammoth.extractRawText({ path: file1 });
    console.log(result1.value);
    console.log('\n' + '='.repeat(80));
    console.log('FILE 2: Ke Hoach Mon Nho.docx');
    console.log('='.repeat(80));
    const result2 = await mammoth.extractRawText({ path: file2 });
    console.log(result2.value);
    
    console.log('\n' + '='.repeat(80));
    console.log('COMPARISON');
    console.log('='.repeat(80));
    console.log('File 1 length:', result1.value.length);
    console.log('File 2 length:', result2.value.length);
    console.log('Are they identical?', result1.value === result2.value);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

compareDocx();
