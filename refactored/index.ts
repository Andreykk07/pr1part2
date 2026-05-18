export type TransactionType = 'income' | 'expense';

export interface Transaction {
  type: TransactionType;
  amount: number;
  date: string | Date;
  category: string;
}

export type CategorySummary = Record<string, number>;

/**
 * Перевіряє, чи належить транзакція до вказаного місяця.
 * @param date - Дата у вигляді рядка або об'єкта Date
 * @param targetMonth - Індекс місяця (0 для січня, 11 для грудня)
 */
export function isTransactionInMonth(date: string | Date, targetMonth: number): boolean {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return false;
  }
  return parsedDate.getMonth() === targetMonth;
}

/**
 * Обчислює підсумковий фінансовий баланс на основі списку транзакцій.
 * @param transactions - Масив фінансових транзакцій
 * @returns Загальний баланс (доходи мінус витрати)
 */
export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'income') {
      return balance + transaction.amount;
    }
    return balance - transaction.amount;
  }, 0);
}

/**
 * Групує суми транзакцій за категоріями для конкретного місяця.
 * @param transactions - Масив фінансових транзакцій
 * @param targetMonth - Індекс місяця для фільтрації (0-11)
 * @returns Об'єкт із сумами, згрупованими за категоріями
 */
export function getMonthlyCategorySummary(
  transactions: Transaction[],
  targetMonth: number
): CategorySummary {
  const summary: CategorySummary = {};

  const monthlyTransactions = transactions.filter((transaction) =>
    isTransactionInMonth(transaction.date, targetMonth)
  );

  for (const transaction of monthlyTransactions) {
    const { category, amount } = transaction;
    
    if (!summary[category]) {
      summary[category] = 0;
    }
    summary[category] += amount;
  }

  return summary;
}
