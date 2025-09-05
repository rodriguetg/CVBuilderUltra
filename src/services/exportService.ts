import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
    Packer, 
    Document, 
    Paragraph, 
    TextRun, 
    HeadingLevel, 
    AlignmentType,
    IStylesOptions,
    UnderlineType
} from 'docx';
import { saveAs } from 'file-saver';
import { CV, CVSectionType } from '../types';

export const exportToPDF = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error('Element not found for PDF export');
    return;
  }

  // We temporarily remove the box-shadow for a cleaner capture
  const originalShadow = input.style.boxShadow;
  input.style.boxShadow = 'none';

  const canvas = await html2canvas(input, {
    scale: 2.5, // Increased scale for better quality
    useCORS: true,
    logging: false,
    width: input.offsetWidth,
    height: input.offsetHeight,
    windowWidth: input.scrollWidth,
    windowHeight: input.scrollHeight
  });

  // Restore the shadow after capture
  input.style.boxShadow = originalShadow;
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4', true);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  const ratio = canvasWidth / canvasHeight;
  let imgWidth = pdfWidth;
  let imgHeight = imgWidth / ratio;

  if (imgHeight > pdfHeight) {
    imgHeight = pdfHeight;
    imgWidth = imgHeight * ratio;
  }

  let position = 0;
  let heightLeft = canvasHeight * (pdfWidth / canvasWidth);

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, heightLeft);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - (canvasHeight * (pdfWidth / canvasWidth));
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (canvasHeight * (pdfWidth / canvasWidth)));
    heightLeft -= pdfHeight;
  }

  pdf.save(`${fileName}.pdf`);
};


export const exportToDocx = async (cv: CV, fileName: string) => {
    const { content, layout, sections } = cv;
    const { colors, fonts } = layout;

    const styles: IStylesOptions = {
        paragraphStyles: [
            {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    font: fonts.heading.split(',')[0],
                    size: 56, // 28pt
                    bold: true,
                    color: colors.primary.replace('#', ''),
                },
                paragraph: {
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                },
            },
            {
                id: "HeaderInfo",
                name: "Header Info",
                basedOn: "Normal",
                run: {
                    font: fonts.body.split(',')[0],
                    size: 22, // 11pt
                    color: '555555',
                },
                paragraph: {
                    alignment: AlignmentType.CENTER,
                }
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    font: fonts.heading.split(',')[0],
                    size: 32, // 16pt
                    bold: true,
                    color: colors.primary.replace('#', ''),
                },
                paragraph: {
                    spacing: { before: 240, after: 120 },
                },
            },
        ],
    };

    const docChildren: Paragraph[] = [
        new Paragraph({ style: "Title", text: content.name }),
        new Paragraph({ style: "HeaderInfo", text: `${content.email} | ${content.phone} | ${content.address}` }),
        new Paragraph({}), // Spacer
    ];

    const sectionRenderer = (type: CVSectionType) => {
        switch (type) {
            case 'summary':
                docChildren.push(new Paragraph({ style: "Heading1", text: "Résumé" }));
                docChildren.push(new Paragraph(content.summary));
                break;
            case 'experience':
                docChildren.push(new Paragraph({ style: "Heading1", text: "Expérience Professionnelle" }));
                content.experience.forEach(exp => {
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: exp.title, bold: true, size: 28 }),
                            new TextRun({ text: ` | ${exp.company}`, italics: true, size: 26 }),
                        ],
                    }));
                    docChildren.push(new Paragraph({
                        text: `${exp.startDate} - ${exp.current ? 'Aujourd\'hui' : exp.endDate}`,
                        style: "HeaderInfo"
                    }));
                    docChildren.push(new Paragraph(exp.description));
                    docChildren.push(new Paragraph({}));
                });
                break;
            case 'education':
                docChildren.push(new Paragraph({ style: "Heading1", text: "Formation" }));
                content.education.forEach(edu => {
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: edu.degree, bold: true, size: 28 }),
                            new TextRun({ text: ` - ${edu.institution}`, size: 26 }),
                        ],
                    }));
                });
                break;
            case 'skills':
                docChildren.push(new Paragraph({ style: "Heading1", text: "Compétences" }));
                docChildren.push(new Paragraph(content.skills.map(s => s.name).join(' • ')));
                break;
            case 'languages':
                docChildren.push(new Paragraph({ style: "Heading1", text: "Langues" }));
                content.languages.forEach(lang => {
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${lang.name}: `, bold: true }),
                            new TextRun(lang.level),
                        ],
                    }));
                });
                break;
        }
    };

    sections.forEach(section => sectionRenderer(section.id));

    const doc = new Document({
        styles: styles,
        sections: [{
            children: docChildren,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
};
