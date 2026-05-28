// utils/pdf.ts — generación de reportes PDF (HU-021, HU-022)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

function encabezado(doc: any, titulo: string, subtitulo: string, total: number) {
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#4B0E0E')
    .text('MUSEO ETNOGRÁFICO "EDGAR PALOMEQUE"', 40, 40, { width: 515, align: 'center' });
  doc.font('Helvetica').fontSize(9).fillColor('#374151')
    .text('Casa de la Cultura Ecuatoriana — Núcleo del Cañar', 40, 58, { width: 515, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#111827')
    .text(titulo, 40, 76, { width: 515, align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor('#6B7280')
    .text(subtitulo, 40, 92, { width: 515, align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor('#6B7280')
    .text(`Generado: ${new Date().toLocaleDateString('es-EC')}  ·  Total piezas: ${total}`, 40, 104, { width: 515, align: 'center' });
  doc.moveTo(40, 118).lineTo(555, 118).strokeColor('#9CA3AF').lineWidth(0.5).stroke();
}

function cel(doc: any, text: string, x: number, y: number, w: number) {
  doc.text(String(text ?? '—'), x, y, { width: w, lineBreak: false });
}

export function pdfInventario(piezas: any[]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    const L = 40, RH = 14, PB = 750;
    const cols = [
      { label: 'CÓDIGO',       x: L,       w: 80 },
      { label: 'NOMBRE',       x: L + 85,  w: 150 },
      { label: 'CATEGORÍA',    x: L + 240, w: 100 },
      { label: 'UBICACIÓN',    x: L + 345, w: 110 },
      { label: 'CONSERVACIÓN', x: L + 460, w: 95 },
    ];
    const cabecera = (y: number) => {
      doc.rect(L, y, 515, RH).fill('#F3F4F6').stroke('#E5E7EB');
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#374151');
      cols.forEach((c) => cel(doc, c.label, c.x + 3, y + 3, c.w - 6));
      return y + RH;
    };
    encabezado(doc, 'Reporte de Inventario Completo', 'Listado de todas las piezas patrimoniales activas', piezas.length);
    let y = cabecera(124);
    doc.font('Helvetica').fontSize(7).fillColor('#111827');
    piezas.forEach((p, i) => {
      if (y + RH > PB) { doc.addPage(); y = cabecera(40); }
      if (i % 2 === 0) doc.rect(L, y, 515, RH).fill('#FAFAFA').stroke('#FAFAFA');
      doc.fillColor('#111827');
      cel(doc, p.codigoInventario, cols[0].x + 3, y + 3, cols[0].w - 6);
      cel(doc, p.nombre?.substring(0, 35) ?? '', cols[1].x + 3, y + 3, cols[1].w - 6);
      cel(doc, p.categoria?.nombre ?? '—', cols[2].x + 3, y + 3, cols[2].w - 6);
      cel(doc, p.ubicacion?.nombre ?? '—', cols[3].x + 3, y + 3, cols[3].w - 6);
      cel(doc, p.estadoConservacion ?? '—', cols[4].x + 3, y + 3, cols[4].w - 6);
      y += RH;
    });
    doc.font('Helvetica').fontSize(7).fillColor('#9CA3AF')
      .text('Sistema de Gestión de Inventario — Museo Etnográfico "Edgar Palomeque"', 40, y + 12, { width: 515, align: 'center' });
    doc.end();
  });
}

export function pdfConservacion(piezas: any[], nivel?: string): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    const L = 40, RH = 14, PB = 750;
    const grupos = nivel ? [nivel] : ['Excelente', 'Bueno', 'Regular', 'Malo'];
    const cols = [
      { label: 'CÓDIGO',    x: L,       w: 85 },
      { label: 'NOMBRE',    x: L + 90,  w: 165 },
      { label: 'CATEGORÍA', x: L + 260, w: 110 },
      { label: 'UBICACIÓN', x: L + 375, w: 110 },
      { label: 'ESTADO',    x: L + 490, w: 65 },
    ];
    const cabecera = (y: number) => {
      doc.rect(L, y, 515, RH).fill('#F3F4F6').stroke('#E5E7EB');
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#374151');
      cols.forEach((c) => cel(doc, c.label, c.x + 3, y + 3, c.w - 6));
      return y + RH;
    };
    encabezado(doc, 'Reporte de Estado de Conservación', nivel ? `Filtrado por nivel: ${nivel}` : 'Todos los niveles de conservación', piezas.length);
    let y = 124;
    for (const niv of grupos) {
      const grupo = piezas.filter((p) => p.estadoConservacion === niv);
      if (!grupo.length) continue;
      if (y + 20 > PB) { doc.addPage(); y = 40; }
      doc.rect(L, y, 515, 16).fill('#E5E7EB').stroke('#D1D5DB');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#111827')
        .text(`${niv.toUpperCase()}  (${grupo.length} pieza${grupo.length > 1 ? 's' : ''})`, L + 6, y + 4, { width: 509 });
      y = cabecera(y + 18);
      doc.font('Helvetica').fontSize(7).fillColor('#111827');
      grupo.forEach((p, i) => {
        if (y + RH > PB) { doc.addPage(); y = cabecera(40); }
        if (i % 2 === 0) doc.rect(L, y, 515, RH).fill('#FAFAFA').stroke('#FAFAFA');
        doc.fillColor('#111827');
        cel(doc, p.codigoInventario, cols[0].x + 3, y + 3, cols[0].w - 6);
        cel(doc, p.nombre?.substring(0, 40) ?? '', cols[1].x + 3, y + 3, cols[1].w - 6);
        cel(doc, p.categoria?.nombre ?? '—', cols[2].x + 3, y + 3, cols[2].w - 6);
        cel(doc, p.ubicacion?.nombre ?? '—', cols[3].x + 3, y + 3, cols[3].w - 6);
        cel(doc, p.estadoConservacion ?? '—', cols[4].x + 3, y + 3, cols[4].w - 6);
        y += RH;
      });
      y += 8;
    }
    doc.font('Helvetica').fontSize(7).fillColor('#9CA3AF')
      .text('Sistema de Gestión de Inventario — Museo Etnográfico "Edgar Palomeque"', 40, y + 12, { width: 515, align: 'center' });
    doc.end();
  });
}
