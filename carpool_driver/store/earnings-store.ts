import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EarningPeriod {
  date: string;
  amount: number;
  trips: number;
}

interface EarningsState {
  daily: EarningPeriod[];
  weekly: EarningPeriod[];
  monthly: EarningPeriod[];
  isLoading: boolean;
  error: string | null;
  fetchEarnings: () => Promise<void>;
}

export const useEarningsStore = create<EarningsState>()(
  persist(
    (set) => ({
      daily: [
        { date: "2023-06-15", amount: 450000, trips: 6 },
        { date: "2023-06-14", amount: 520000, trips: 7 },
        { date: "2023-06-13", amount: 380000, trips: 5 },
        { date: "2023-06-12", amount: 490000, trips: 6 },
        { date: "2023-06-11", amount: 610000, trips: 8 },
        { date: "2023-06-10", amount: 350000, trips: 4 },
        { date: "2023-06-09", amount: 400000, trips: 5 },
      ],
      weekly: [
        { date: "2023-06-12 - 2023-06-18", amount: 3200000, trips: 42 },
        { date: "2023-06-05 - 2023-06-11", amount: 2950000, trips: 38 },
        { date: "2023-05-29 - 2023-06-04", amount: 3100000, trips: 40 },
        { date: "2023-05-22 - 2023-05-28", amount: 3250000, trips: 43 },
      ],
      monthly: [
        { date: "2023-06", amount: 12500000, trips: 165 },
        { date: "2023-05", amount: 13200000, trips: 172 },
        { date: "2023-04", amount: 11800000, trips: 155 },
        { date: "2023-03", amount: 12300000, trips: 160 },
      ],
      isLoading: false,
      error: null,
      fetchEarnings: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // Data is already set in the initial state
          set({ isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch earnings data", isLoading: false });
        }
      },
    }),
    {
      name: "earnings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
