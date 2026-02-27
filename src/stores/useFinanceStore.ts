import { create } from "zustand";

interface FinanceStore {
  aum: number;
  totalAum: number;
  deductFromAum: (amount: number) => void;
  addToAum: (amount: number) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  aum: 1250000000,
  totalAum: 2000000000,

  deductFromAum: (amount) =>
    set((state) => ({ aum: state.aum - amount })),

  addToAum: (amount) =>
    set((state) => ({ aum: state.aum + amount })),
}));
