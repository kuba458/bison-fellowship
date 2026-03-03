const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to 16:9 landscape for presentation feel
  await page.setViewport({ width: 1440, height: 810 });

  // Navigate to the presentation
  await page.goto('http://localhost:8765/presentation.html', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Add pdf-mode class and force all animations visible
  await page.evaluate(() => {
    document.body.classList.add('pdf-mode');
    document.querySelectorAll('.animate').forEach(el => {
      el.classList.add('visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
    // Hide nav dots
    const nav = document.getElementById('slideNav');
    if (nav) nav.style.display = 'none';
  });

  // Wait for images to load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate PDF
  const outputPath = path.join(__dirname, 'Bison_Fellowship_Oferta_Wspolpracy.pdf');

  await page.pdf({
    path: outputPath,
    width: '1440px',
    height: '810px',
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log('PDF generated: ' + outputPath);

  await browser.close();
})();
