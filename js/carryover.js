import {
  consuntivoBalance,
  effectiveConsuntivoBalance,
  getNextPeriod,
  getPreviousPeriod
} from './fiscal.js';

export { getNextPeriod, getPreviousPeriod };

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

  const rawBalance = consuntivoBalance(house, prev.id);
  const outstanding = effectiveConsuntivoBalance(house, prev.id);
  if (rawBalance === null || outstanding === null || Math.abs(outstanding) < 0.005) return null;
  if (hasCarryDueForPeriod(house, newPeriodId, prev.id)) return null;

  return {
    fromPeriodId: prev.id,
    fromLabel: prev.label,
    consuntivoBalance: outstanding,
    consuntivoBalanceRaw: rawBalance,
    /** Voce preventivo: negativa se eccedenza, positiva se debito da recuperare */
    suggestedDueAmount: -outstanding
  };
}
