const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Replace template variables with provided values
 * @param {string} template - The HTML template string
 * @param {object} vars - The variables to replace
 * @returns {string} - The updated HTML string
 */
function replaceTemplateVars(template, vars) {
  return template.replace(/\$\{(.*?)\}/g, (_, key) => vars[key] || '');
}

/**
 * Generate a PDF from an HTML string
 * @param {string} html - The HTML content
 * @param {string} outputPath - The path to save the PDF
 */
async function generatePdf(html, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set HTML content
  await page.setContent(html, { waitUntil: 'load' });

  // Generate PDF
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });

  console.log(`PDF generated at ${outputPath}`);
  await browser.close();
}

(async () => {
  try {
    // Read the HTML template
    const templatePath = path.join(__dirname, 'email.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Replace variables in the template
    const vars = { name: 'John Doe', age: 30 };
    const updatedHtml = replaceTemplateVars(template, vars);

    // Generate the PDF
    const outputPath = path.join(__dirname, 'output.pdf');
    await generatePdf(updatedHtml, outputPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
})();
