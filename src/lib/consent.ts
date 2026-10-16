import { useSyncExternalStore } from "react";

/**
 * Gestione del consenso (GDPR art. 6.1.a e art. 7, Direttiva ePrivacy art. 5.3,
 * Linee guida del Garante del 10 giugno 2021).
 * - Nessun servizio non necessario parte prima della scelta dell'utente.
 * - La scelta è salvata nel browser (localStorage), non su un server.
 * - La scelta scade dopo 6 mesi e viene richiesta di nuovo.
 */
const KEY = "masseria-consenso";
const VERSIONE = 1;
const DURATA_MS = 1000 * 60 * 60 * 24 * 182;

export type Consenso = { versione: number; ts: number; maps: boolean };

type Stato = { pronto: boolean; consenso: Consenso | null; pannello: boolean };

let stato: Stato = { pronto: false, consenso: null, pannello: false };
const ascoltatori = new Set<() => void>();
const emetti = () => ascoltatori.forEach((l) => l());
const aggiorna = (p: Partial<Stato>) => {
  stato = { ...stato, ...p };
  emetti();
};

export function inizializzaConsenso() {
  if (stato.pronto || typeof window === "undefined") return;
  let c: Consenso | null = null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Consenso;
      if (p.versione === VERSIONE && Date.now() - p.ts < DURATA_MS) c = p;
      else window.localStorage.removeItem(KEY);
    }
  } catch {
    c = null;
  }
  aggiorna({ pronto: true, consenso: c });
}

export function salvaConsenso(maps: boolean) {
  const c: Consenso = { versione: VERSIONE, ts: Date.now(), maps };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* storage non disponibile: la scelta vale solo per la sessione */
  }
  aggiorna({ consenso: c, pannello: false });
}

export const apriPreferenze = () => aggiorna({ pannello: true });
export const chiudiPreferenze = () => aggiorna({ pannello: false });

const sottoscrivi = (l: () => void) => {
  ascoltatori.add(l);
  return () => ascoltatori.delete(l);
};
const server: Stato = { pronto: false, consenso: null, pannello: false };

export function useConsenso() {
  return useSyncExternalStore(sottoscrivi, () => stato, () => server);
}
