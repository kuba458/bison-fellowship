#!/usr/bin/env python3
"""Generate PDF from presentation.html using WeasyPrint."""

import re
from pathlib import Path
from weasyprint import HTML

html_path = Path(__file__).parent / "presentation.html"
output_path = Path(__file__).parent / "Bison_Fellowship_Oferta_Wspolpracy.pdf"

html_content = html_path.read_text(encoding="utf-8")

# Remove video/iframe elements that slow down rendering
html_content = re.sub(r'<video[^>]*>.*?</video>', '', html_content, flags=re.DOTALL)
html_content = re.sub(r'<iframe[^>]*>.*?</iframe>', '', html_content, flags=re.DOTALL)

# Remove all <script> blocks
html_content = re.sub(r'<script[\s\S]*?</script>', '', html_content)

# Remove click hint
html_content = re.sub(r'<div class="slide-click-hint"[\s\S]*?</div>\s*</div>', '', html_content)

# Inject CSS overrides before </style>
pdf_css = """
    /* PDF overrides */
    * { transition: none !important; animation: none !important; }
    .slides-wrapper {
      position: relative !important;
      height: auto !important;
      overflow: visible !important;
    }
    .slide {
      position: relative !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      page-break-after: always;
      page-break-inside: avoid;
      width: 100%;
      min-height: 0;
      height: auto;
      min-height: 100vh;
    }
    .slide:last-child { page-break-after: auto; }
    .animate, .animate.visible {
      opacity: 1 !important;
      transform: none !important;
    }
    .slide-nav, .slide-click-hint, nav { display: none !important; }
    @page { size: 1440px 810px; margin: 0; }
"""

html_content = html_content.replace("</style>", pdf_css + "\n  </style>")

base_url = html_path.parent.as_uri() + "/"

print("Generating PDF...")
HTML(string=html_content, base_url=base_url).write_pdf(str(output_path))
print(f"PDF generated: {output_path}")
