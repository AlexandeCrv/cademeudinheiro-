import { useEffect } from "react";

export function useTransactionFilters(
  transactions,
  searchTerm,
  activeFilter,
  dateRange,
  setFilteredTransactions
) {
  useEffect(() => {
    let filtered = [...transactions];

    if (activeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === activeFilter);
    }

    if (dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((t) => {
        const transDate = new Date(t.createdAt);

        if (dateRange === "today") {
          return transDate >= today;
        } else if (dateRange === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transDate >= weekAgo;
        } else if (dateRange === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transDate >= monthAgo;
        }

        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, activeFilter, dateRange, setFilteredTransactions]);
}
