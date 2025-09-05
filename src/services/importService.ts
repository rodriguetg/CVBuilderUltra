import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// The worker is needed for pdf.js to work in the browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseCVFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'application/pdf' || fileExtension === 'pdf') {
    return parsePdf(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileExtension === 'docx'
  ) {
    return parseDocx(file);
  } else if (fileType === 'application/msword' || fileExtension === 'doc') {
    // Mammoth has limited .doc support, but we can try
    return parseDocx(file);
  } else {
    throw new Error('Format de fichier non supporté. Veuillez utiliser PDF, DOCX ou DOC.');
  }
};

const parsePdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let textContent = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    // The item can be a TextItem or a TextMarkedContent
    const pageText = text.items.map(item => ('str' in item ? item.str : '')).join(' ');
    textContent += pageText + '\n';
  }

  return textContent;
};

const parseDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};
