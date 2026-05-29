import { consuntivoBalance, periodLabel } from './fiscal.js';

export function getPreviousPeriod(house, periodId) {
  const sorted = [...house.fiscalPeriods].sort((a, b) =>
    String(a.startDate).localeCompare(String(b.startDate))
  );
  const idx = sorted.findIndex(p => p.id === periodId);
  if (idx <= 0) return null;
  return sorted[idx - 1];
}

export function getNextPeriod(house, periodId) {
  const sorted = [...house.fiscalPeriods].sort((a, b) =>
    String(a.startDate).localeCompare(String(b.startDate))
  );
  const idx = sorted.findIndex(p => p.id === periodId);
  if (idx < 0 || idx >= sorted.length - 1) return null;
  return sorted[idx + 1];
}

export function hasCarryDueForPeriod(house, toPeriodId, fromPeriodId) {
  return house.dues.some(d =>
    d.fiscalPeriodId === toPeriodId &&
    d.carryFromPeriodId &&
    String(d.carryFromPeriodId) === String(fromPeriodId)
  );
}

/**
 * Eccedenza sul consuntivo dell'esercizio precedente → voce preventivo sull'esercizio nuovo.
 * Importo suggerito = −saldo consuntivo (eccedenza +3 → preventivo −3€, credito).
 */
export function suggestCarryover(house, newPeriodId) {
  const prev = getPreviousPeriod(house, newPeriodId);
  if (!prev) return null;
  const nextOfPrev = getNextPeriod(house, prev.id);
  if (!nextOfPrev || nextOfPrev.id !== newPeriodId) return null;

  const balance = consuntivoBalance(house, prev.id);
  if (balance === null || Math.abs(balance) < 0.005) return null;
  if (hasCarryDueForPeriod(house, newPeriodId, prev.id)) return null;

  return {
    fromPeriodId: prev.id,
    fromLabel: prev.label,
    consuntivoBalance: balance,
    /** Voce preventivo: negativa se eccedenza, positiva se debito da recuperare */
    suggestedDueAmount: -balance
  };
}
