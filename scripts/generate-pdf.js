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
  loreal: {
    url: 'http://localhost:5173/clients/loreal/',
    output: 'Bison_Fellowship_LOreal.pdf',
  },
  santander: {
    url: 'http://localhost:5173/clients/santander/',
    output: 'Bison_Fellowship_Santander.pdf',
  },
  mbank: {
    url: 'http://localhost:5173/clients/mbank/',
    output: 'Bison_Fellowship_mBank.pdf',
  },
  'benefit-systems': {
    url: 'http://localhost:5173/clients/benefit-systems/',
    output: 'Bison_Fellowship_Benefit_Systems.pdf',
  },
  bgk: {
    url: 'http://localhost:5173/clients/bgk/',
    output: 'Bison_Fellowship_BGK.pdf',
  },
  'alior-bank': {
    url: 'http://localhost:5173/clients/alior-bank/',
    output: 'Bison_Fellowship_Alior_Bank.pdf',
  },
  'bank-pekao': {
    url: 'http://localhost:5173/clients/bank-pekao/',
    output: 'Bison_Fellowship_Bank_Pekao.pdf',
  },
  kghm: {
    url: 'http://localhost:5173/clients/kghm/',
    output: 'Bison_Fellowship_KGHM.pdf',
  },
  'pko-bp': {
    url: 'http://localhost:5173/clients/pko-bp/',
    output: 'Bison_Fellowship_PKO_Bank_Polski.pdf',
  },
  lot: {
    url: 'http://localhost:5173/clients/lot/',
    output: 'Bison_Fellowship_LOT.pdf',
  },
  pge: {
    url: 'http://localhost:5173/clients/pge/',
    output: 'Bison_Fellowship_PGE.pdf',
  },
  pzu: {
    url: 'http://localhost:5173/clients/pzu/',
    output: 'Bison_Fellowship_PZU.pdf',
  },
  'pkn-orlen': {
    url: 'http://localhost:5173/clients/pkn-orlen/',
    output: 'Bison_Fellowship_PKN_Orlen.pdf',
  },
  xtb: {
    url: 'http://localhost:5173/clients/xtb/',
    output: 'Bison_Fellowship_XTB.pdf',
  },
};

const clientName = process.argv[2];

// Support "all" to generate PDFs for every client sequentially
if (clientName === 'all') {
  (async () => {
    for (const [name, config] of Object.entries(clients)) {
      console.log(`\n=== Generating PDF for: ${name} ===`);
      try {
        await generatePdf(config);
      } catch (err) {
        console.error(`  ERROR generating ${name}:`, err.message);
      }
    }
  })();
} else {
  if (!clientName || !clients[clientName]) {
    console.error(`Usage: node generate-pdf.js <${Object.keys(clients).join('|')}|all>`);
    process.exit(1);
  }
  generatePdf(clients[clientName]);
}

const WIDTH = 1440;
const HEIGHT = 810;

async function generatePdf(config) {
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
}
