import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api';

export type TransactionType = 'trip_earning' | 'withdrawal' | 'deposit' | 'bonus' | 'refund';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  tripId?: string;
}

interface WalletContextType {
  balance: {
    available: number;
    pending: number;
    total: number;
  };
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchWalletData: () => Promise<void>;
  withdrawMoney: (amount: number, bankDetails: any) => Promise<boolean>;
  addMoney: (amount: number, paymentMethod: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState({
    available: 0,
    pending: 0,
    total: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load wallet data from AsyncStorage on mount
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const walletData = await AsyncStorage.getItem('wallet-data');
        if (walletData) {
          const parsedData = JSON.parse(walletData);
          setBalance(parsedData.balance);
          setTransactions(parsedData.transactions);
        }
      } catch (e) {
        console.error('Failed to load wallet data:', e);
      }
    };

    loadWalletData();
    fetchWalletData();
  }, []);

  // Save wallet data to AsyncStorage when it changes
  useEffect(() => {
    const saveWalletData = async () => {
      try {
        const walletData = JSON.stringify({
          balance,
          transactions,
        });
        await AsyncStorage.setItem('wallet-data', walletData);
      } catch (e) {
        console.error('Failed to save wallet data:', e);
      }
    };

    saveWalletData();
  }, [balance, transactions]);

  const fetchWalletData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.wallet.getWalletData();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const withdrawMoney = useCallback(async (amount: number, bankDetails: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await api.wallet.withdrawMoney(amount, bankDetails);
      if (result.success) {
        // Update balance and add transaction
        setBalance(prev => ({
          ...prev,
          available: prev.available - amount,
          total: prev.total - amount,
        }));
        
        setTransactions(prev => [result.transaction, ...prev]);
        return true;
      }
      return false;
    } catch (error) {