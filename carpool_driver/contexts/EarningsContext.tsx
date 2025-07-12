import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/services/api";

interface EarningPeriod {
  date: string;
  amount: number;
  trips: number;
}

interface EarningsContextType {
  daily: EarningPeriod[];
  weekly: EarningPeriod[];
  monthly: EarningPeriod[];
  isLoading: boolean;
  error: string | null;
  fetchEarnings: () => Promise<void>;
}

const EarningsContext = createContext<EarningsContextType | undefined>(
  undefined
);

export const useEarnings = () => {
  const context = useContext(EarningsContext);
  if (context === undefined) {
    throw new Error("useEarnings must be used within an EarningsProvider");
  }
  return context;
};

interface EarningsProviderProps {
  children: React.ReactNode;
}

export const EarningsProvider: React.FC<EarningsProviderProps> = ({
  children,
}) => {
  const [daily, setDaily] = useState<EarningPeriod[]>([]);
  const [weekly, setWeekly] = useState<EarningPeriod[]>([]);
  const [monthly, setMonthly] = useState<EarningPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.driver.getEarnings();
      setDaily(data.daily);
      setWeekly(data.weekly);
      setMonthly(data.monthly);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch earnings data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load earnings data on mount
  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const value = {
    daily,
    weekly,
    monthly,
    isLoading,
    error,
    fetchEarnings,
  };

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
};
