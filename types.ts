
export interface Counter {
  id: string;
  label: string;
  value: number;
  incrementKey: string;
  decrementKey: string;
  color: string;
}

export type CounterUpdate = Partial<Omit<Counter, 'id'>>;

export interface HistoryEntry {
  id: string;
  counterId: string;
  counterLabel: string;
  change: number;
  timestamp: number;
}
