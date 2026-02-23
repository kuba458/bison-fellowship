const puppeteer = require('puppeteer');
const path = require('path');

const clients = {
  pse: {
    url: 'http://localhost:5173/clients/pse/',
    output: 'Bison_Fellowship_Oferta_Wspolpracy.pdf',
  },
  'pkp-intercity': {
    url: 'http://localhost:5173/clients/pkp-intercity/',
    output: 'Bison_Fellowship_PKP_Intercity.pdf',
  },
};

const clientName = process.argv[2];

if (!clientName || !clients[clientName]) {
  console.error(`Usage: node generate-pdf.js <${Object.keys(clients).join('|')}>`);
  process.exit(1);
}

const config = clients[clientName];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to 16:9 landscape for presentation feel
  await page.setViewport({ width: 1440, height: 810 });

  // Navigate to the presentation
  await page.goto(config.url, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Prepare for PDF: force animations visible, replace video with image
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

    // Hide click hint
    const hint = document.getElementById('clickHint');
    if (hint) hint.style.display = 'none';

    // Replace YouTube iframe with static image
    const videoWrap = document.querySelector('.origin-video-wrap');
    if (videoWrap) {
      videoWrap.innerHTML = '';
      const img = document.createElement('img');
      img.src = '../../assets/krakow-zdj-slideshow-1.jpg';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      videoWrap.appendChild(img);
    }
  });

  // Wait for images/fonts to load
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Generate PDF
  const outputPath = path.join(__dirname, '..', config.output);

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
