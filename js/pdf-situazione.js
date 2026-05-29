import { buildSituazioneReport, carryFromLabel, situazioneStatusLabel } from './situazione-report.js';
import { fmt } from './utils.js';

async function loadPdfLibs() {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import('https://esm.sh/jspdf@2.5.2'),
    import('https://esm.sh/jspdf-autotable@3.8.4')
  ]);
  return { jsPDF: jsPDF.default || jsPDF, autoTable: autoTableMod.default };
}

function addSectionTitle(doc, y, title) {
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, 14, y);
  doc.setFont(undefined, 'normal');
  return y + 6;
}

export async function exportSituazionePdf(house, fiscalPeriodId) {
  const report = buildSituazioneReport(house, fiscalPeriodId);
  const { period, totalsRow, slots, consuntivoDues, unlinkedPayments } = report;
  if (!period) throw new Error('Seleziona un esercizio fiscale.');

  const { jsPDF, autoTable } = await loadPdfLibs();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let y = 14;
  doc.setFontSize(14);
  doc.text('Situazione spese condominiali', 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Immobile: ${house.name}`, 14, y);
  y += 5;
  doc.text(`Esercizio: ${period.label} (${period.startDate} → ${period.endDate})`, 14, y);
  y += 5;
  doc.text(`Export: ${new Date().toLocaleString('it-IT')}`, 14, y);
  y += 8;

  const consStatus = situazioneStatusLabel(totalsRow?.balanceConsuntivo ?? 0);

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    body: [
      ['Preventivo (totale voci)', fmt(totalsRow?.preventivo ?? 0)],
      ['Consuntivo (totale voci)', fmt(totalsRow?.consuntivo ?? 0)],
      ['Totale versato', fmt(totalsRow?.paid ?? 0)],
      ['Saldo su rate preventivo', fmt(report.slotsBalance)],
      ['Saldo consuntivo (versato − consuntivo)', `${fmt(totalsRow?.balanceConsuntivo ?? 0)} — ${consStatus.text}`],
      ['Saldo su preventivo (versato − preventivo)', `${fmt(totalsRow?.balancePreventivo ?? 0)} — ${prevStatus.text}`]
    ],
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 95 }, 1: { cellWidth: 75 } }
  });
  y = doc.lastAutoTable.finalY + 10;

  if (slots.length) {
    y = addSectionTitle(doc, y, 'Preventivo — dettaglio rate');
    const rateBody = [];
    for (const slot of slots) {
      rateBody.push([slot.label, slot.dueDescription || '—', fmt(slot.amountDue), fmt(slot.paid), fmt(slot.balance)]);
      for (const pay of slot.payments) {
        rateBody.push([
          `  ↳ vers. ${pay.date || '—'}`,
          pay.method || '—',
          '',
          fmt(pay.amount),
          pay.isCarryForward ? 'Riporto' : ''
        ]);
      }
    }
    rateBody.push(['Totale rate', '', fmt(report.slotsTotalDue), fmt(report.slotsTotalPaid), fmt(report.slotsBalance)]);
    autoTable(doc, {
      startY: y,
      head: [['Rata', 'Voce preventivo', 'Dovuto', 'Versato', 'Saldo']],
      body: rateBody,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [45, 85, 135] }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (consuntivoDues.length) {
    y = addSectionTitle(doc, y, 'Consuntivo — voci');
    autoTable(doc, {
      startY: y,
      head: [['Descrizione', 'Importo']],
      body: consuntivoDues.map(d => [d.description || 'Consuntivo', fmt(d.amount)]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [80, 80, 80] }
    });
    y = doc.lastAutoTable.finalY + 4;
    doc.setFontSize(9);
    doc.text(
      `Totale consuntivo: ${fmt(report.consuntivoTotal)} · Versato esercizio: ${fmt(report.paidTotal)} · Saldo: ${fmt(totalsRow?.balanceConsuntivo ?? 0)}`,
      14,
      y + 4
    );
    y += 14;
  }

  if (report.carryDues.length) {
    y = addSectionTitle(doc, y, 'Riporti su preventivo');
    autoTable(doc, {
      startY: y,
      head: [['Descrizione', 'Da esercizio', 'Importo']],
      body: report.carryDues.map(d => [
        d.description || 'Riporto',
        carryFromLabel(house, d),
        fmt(d.amount)
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 70, 20] }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (unlinkedPayments.length) {
    y = addSectionTitle(doc, y, 'Versamenti senza rata assegnata');
    autoTable(doc, {
      startY: y,
      head: [['Data', 'Metodo', 'Importo']],
      body: unlinkedPayments.map(p => [p.date || '—', p.method || '—', fmt(p.amount)]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [120, 50, 50] }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  doc.setFontSize(8);
  doc.text(
    'Documento generato per verifica verso l\'amministratore. Saldo consuntivo = versato − consuntivo; eccedenze riportate sul preventivo dell\'esercizio successivo.',
    14,
    Math.min(y + 4, 285),
    { maxWidth: 180 }
  );

  const safeName = `${house.name}-${period.label}`.replace(/[^\w\-]+/g, '_');
  doc.save(`situazione-${safeName}.pdf`);
}
