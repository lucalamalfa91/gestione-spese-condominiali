import {
  buildSituazioneReport,
  carryFromLabel,
  resolveSituazionePdfKind,
  situazioneStatusLabel
} from './situazione-report.js';
import { fmt } from './utils.js';

async function loadPdfLibs() {
  const [jspdfMod, autoTableMod] = await Promise.all([
    import('https://esm.sh/jspdf@2.5.2'),
    import('https://esm.sh/jspdf-autotable@3.8.4')
  ]);
  const jsPDF = jspdfMod.jsPDF?.default || jspdfMod.jsPDF || jspdfMod.default;
  const autoTable = autoTableMod.default || autoTableMod.autoTable;
  if (!jsPDF || !autoTable) throw new Error('Librerie PDF non disponibili.');
  return { jsPDF, autoTable };
}

function addSectionTitle(doc, y, title) {
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, 14, y);
  doc.setFont(undefined, 'normal');
  return y + 6;
}

function renderPdfHeader(doc, house, period, reportTitle) {
  let y = 14;
  doc.setFontSize(14);
  doc.text(reportTitle, 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Immobile: ${house.name}`, 14, y);
  y += 5;
  doc.text(`Esercizio: ${period.label} (${period.startDate} → ${period.endDate})`, 14, y);
  y += 5;
  doc.text(`Export: ${new Date().toLocaleString('it-IT')}`, 14, y);
  return y + 8;
}

function renderPreventivoPdf(doc, autoTable, report, totalsRow) {
  let y = renderPdfHeader(doc, report.house, report.period, 'Situazione preventiva — spese condominiali');
  const prevStatus = situazioneStatusLabel(totalsRow?.balancePreventivo ?? 0);
  const slotsStatus = situazioneStatusLabel(report.slotsBalance ?? 0);

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    body: [
      ['Preventivo (totale voci)', fmt(totalsRow?.preventivo ?? 0)],
      ['Totale versato', fmt(totalsRow?.paid ?? 0)],
      ['Saldo su rate preventivo', fmt(report.slotsBalance)],
      ['Saldo su preventivo (versato − preventivo)', `${fmt(totalsRow?.balancePreventivo ?? 0)} — ${prevStatus.text}`],
      ['Saldo rate (versato − dovuto rate)', `${fmt(report.slotsBalance)} — ${slotsStatus.text}`]
    ],
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 95 }, 1: { cellWidth: 75 } }
  });
  y = doc.lastAutoTable.finalY + 10;

  const { slots } = report;
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

  if (report.carryDues.length) {
    y = addSectionTitle(doc, y, 'Riporti su preventivo');
    autoTable(doc, {
      startY: y,
      head: [['Descrizione', 'Da esercizio', 'Importo']],
      body: report.carryDues.map(d => [
        d.description || 'Riporto',
        carryFromLabel(report.house, d),
        fmt(d.amount)
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 70, 20] }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (report.unlinkedPayments.length) {
    y = addSectionTitle(doc, y, 'Versamenti senza rata assegnata');
    autoTable(doc, {
      startY: y,
      head: [['Data', 'Metodo', 'Importo']],
      body: report.unlinkedPayments.map(p => [p.date || '—', p.method || '—', fmt(p.amount)]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [120, 50, 50] }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  doc.setFontSize(8);
  doc.text(
    'Report preventivo: rate e saldi su preventivo. Saldo preventivo = versato − totale voci preventivo.',
    14,
    Math.min(y + 4, 285),
    { maxWidth: 180 }
  );
}

function renderConsuntivoPdf(doc, autoTable, report, totalsRow) {
  let y = renderPdfHeader(doc, report.house, report.period, 'Situazione consuntiva — spese condominiali');
  const consStatus = situazioneStatusLabel(totalsRow?.balanceConsuntivo ?? 0);

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    body: [
      ['Consuntivo (totale voci)', fmt(totalsRow?.consuntivo ?? 0)],
      ['Totale versato', fmt(totalsRow?.paid ?? 0)],
      ['Saldo consuntivo (versato − consuntivo)', `${fmt(totalsRow?.balanceConsuntivo ?? 0)} — ${consStatus.text}`]
    ],
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 95 }, 1: { cellWidth: 75 } }
  });
  y = doc.lastAutoTable.finalY + 10;

  const { consuntivoDues } = report;
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

  if (report.unlinkedPayments.length) {
    y = addSectionTitle(doc, y, 'Versamenti senza rata assegnata');
    autoTable(doc, {
      startY: y,
      head: [['Data', 'Metodo', 'Importo']],
      body: report.unlinkedPayments.map(p => [p.date || '—', p.method || '—', fmt(p.amount)]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [120, 50, 50] }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  doc.setFontSize(8);
  doc.text(
    'Report consuntivo: saldo = versato − consuntivo. Le eccedenze possono essere riportate sul preventivo dell\'esercizio successivo.',
    14,
    Math.min(y + 4, 285),
    { maxWidth: 180 }
  );
}

export async function exportSituazionePdf(house, fiscalPeriodId, requestedKind) {
  const report = buildSituazioneReport(house, fiscalPeriodId);
  report.house = house;
  const { period, totalsRow } = report;
  if (!period) throw new Error('Seleziona un esercizio fiscale.');

  const kind = resolveSituazionePdfKind(report, requestedKind);
  if (!kind) throw new Error('Nessun preventivo o consuntivo per questo esercizio.');

  const { jsPDF, autoTable } = await loadPdfLibs();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  if (kind === 'consuntivo') renderConsuntivoPdf(doc, autoTable, report, totalsRow);
  else renderPreventivoPdf(doc, autoTable, report, totalsRow);

  const safeName = `${house.name}-${period.label}-${kind}`.replace(/[^\w\-]+/g, '_');
  doc.save(`situazione-${safeName}.pdf`);
}
