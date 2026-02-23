const puppeteer = require('puppeteer');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

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

const WIDTH = 1440;
const HEIGHT = 810;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  await page.goto(config.url, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Prepare: force animations visible, replace video with image
  await page.evaluate(() => {
    document.body.classList.add('pdf-mode');
    document.querySelectorAll('.animate').forEach(el => {
      el.classList.add('visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });

    const nav = document.getElementById('slideNav');
    if (nav) nav.style.display = 'none';

    const hint = document.getElementById('clickHint');
    if (hint) hint.style.display = 'none';

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

  // Get slide count
  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`Found ${slideCount} slides`);

  // Screenshot each slide individually
  const screenshots = [];
  for (let i = 0; i < slideCount; i++) {
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, j) => {
        if (j === idx) {
          s.classList.add('active-slide');
          s.style.opacity = '1';
          s.style.transform = 'none';
          s.style.pointerEvents = 'auto';
          s.style.position = 'relative';
          s.style.display = 'flex';
        } else {
          s.classList.remove('active-slide');
          s.style.display = 'none';
        }
      });
    }, i);

    await new Promise(resolve => setTimeout(resolve, 200));

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT }
    });
    screenshots.push(screenshotBuffer);
    console.log(`  Captured slide ${i + 1}/${slideCount}`);
  }

  // Combine screenshots into a single PDF using pdf-lib
  const pdfDoc = await PDFDocument.create();

  for (const pngBuffer of screenshots) {
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    const pdfPage = pdfDoc.addPage([WIDTH, HEIGHT]);
    pdfPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT,
    });
  }

  const outputPath = path.join(__dirname, '..', config.output);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log('PDF generated: ' + outputPath);

  await browser.close();
})();
