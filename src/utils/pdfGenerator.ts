import { jsPDF } from "jspdf";
// html2canvas-pro (not the plain html2canvas package) is required because
// Tailwind v4's default palette emits modern CSS color functions (oklch/lab)
// that stock html2canvas 1.x cannot parse and fails on immediately.
import html2canvas from "html2canvas-pro";
import { BrochureData } from "../types";

/**
 * Captures the actual rendered brochure pages from the DOM (elements with
 * id="print-page-N") and assembles them into a PDF. This keeps the PDF
 * pixel-faithful to the on-screen preview (dark theme, rounded stat cards,
 * gradients, icons, etc.) instead of a separately hand-drawn jsPDF layout.
 *
 * Requires the BrochurePreview to be mounted with `showAllPages` set to
 * true so every `#print-page-*` node exists in the DOM when this runs.
 */
export async function exportBrochureToPDF(
  data: BrochureData,
  contactInfo: {
    website: string;
    email: string;
    phone: string;
    address: string;
    github?: string;
  },
  colorTheme: string,
  hideChatbot: boolean = false
) {
  const activePages = hideChatbot ? [1, 2, 4, 6, 7, 8] : [1, 2, 3, 4, 5, 6, 7, 8];

  const pageEls = activePages.map((p) => document.getElementById(`print-page-${p}`));
  const missing = activePages.filter((_, i) => !pageEls[i]);

  if (missing.length > 0) {
    throw new Error(
      `exportBrochureToPDF: missing page element(s) #print-page-${missing.join(
        ", #print-page-"
      )}. The brochure preview may not have finished rendering yet.`
    );
  }

  const readyPageEls = pageEls as HTMLElement[];

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < readyPageEls.length; i++) {
    const el = readyPageEls[i];
    const canvas = await html2canvas(el, {
      scale: 2, // high resolution for crisp vector-like text
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const naturalWidth = pageWidth;
    const naturalHeight = (canvas.height * naturalWidth) / canvas.width;

    if (i > 0) doc.addPage();

    // Each #print-page-N div represents exactly one printed page, so it
    // should always map 1:1 to a single PDF page. Real captured content is
    // rarely an exact A4 ratio (sub-pixel/box-shadow rounding can push it a
    // hair over), so "contain"-fit the image within the page bounds instead
    // of slicing on any overflow — slicing on tiny overshoots produced an
    // extra, near-blank page for almost every brochure page.
    // 1.4x is well above the sub-mm rounding overshoot seen from real DOM
    // captures (a few % at most) but well below "this is actually multiple
    // printed pages of content" (which would be ~2x+), so it only catches
    // genuine overflow, not rendering noise.
    const OVERFLOW_TOLERANCE = 1.4;
    if (naturalHeight <= pageHeight * OVERFLOW_TOLERANCE) {
      const scale = Math.min(pageWidth / naturalWidth, pageHeight / naturalHeight, 1);
      const imgWidth = naturalWidth * scale;
      const imgHeight = naturalHeight * scale;
      const offsetX = (pageWidth - imgWidth) / 2;
      const offsetY = (pageHeight - imgHeight) / 2;
      doc.addImage(imgData, "JPEG", offsetX, offsetY, imgWidth, imgHeight);
    } else {
      // Genuinely taller than one page: slice across multiple PDF pages.
      let renderedHeight = 0;
      let first = true;
      while (renderedHeight < naturalHeight) {
        if (!first) doc.addPage();
        first = false;
        doc.addImage(imgData, "JPEG", 0, -renderedHeight, naturalWidth, naturalHeight);
        renderedHeight += pageHeight;
      }
    }
  }

  const cleanIndustryName = data.testimonial.company?.replace(/[^a-zA-Z0-9]/g, "_") || "Rubro";
  doc.save(`Brochure_Clientum_2026_${cleanIndustryName}.pdf`);
}
