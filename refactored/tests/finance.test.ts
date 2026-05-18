import { calculateBalance, getMonthlyCategorySummary, isTransactionInMonth, Transaction } from '../refactored/index';

describe('Financial Utils Refactored Tests', () => {

  // --- Тести для calculateBalance ---
  
  test('1. calculateBalance: повинен повертати 0 для порожнього масиву', () => {
    expect(calculateBalance([])).toBe(0);
  });

  test('2. calculateBalance: повинен коректно сумувати лише доходи', () => {
    const transactions: Transaction[] = [
      { type: 'income', amount: 100, date: '2026-05-10', category: 'Salary' },
      { type: 'income', amount: 50, date: '2026-05-11', category: 'Bonus' }
    ];
    expect(calculateBalance(transactions)).toBe(150);
  });

  test('3. calculateBalance: повинен коректно віднімати витрати', () => {
    const transactions: Transaction[] = [
      { type: 'expense', amount: 40, date: '2026-05-10', category: 'Food' },
      { type: 'expense', amount: 20, date: '2026-05-11', category: 'Transport' }
    ];
    expect(calculateBalance(transactions)).toBe(-60);
  });

  test('4. calculateBalance: повинен працювати з міксом доходів та витрат', () => {
    const transactions: Transaction[] = [
      { type: 'income', amount: 200, date: '2026-05-10', category: 'Salary' },
      { type: 'expense', amount: 50, date: '2026-05-11', category: 'Food' },
      { type: 'income', amount: 20, date: '2026-05-12', category: 'Refund' }
    ];
    expect(calculateBalance(transactions)).toBe(170);
  });

  test('5. calculateBalance: граничний випадок — обробка від\'ємних значень в amount', () => {
    // Якщо бізнес-логіка допускає помилкові від'ємні значення, перевіряємо математичну коректність
    const transactions: Transaction[] = [
      { type: 'income', amount: -100, date: '2026-05-10', category: 'Adjustment' }, // 0 + (-100) = -100
      { type: 'expense', amount: -50, date: '2026-05-11', category: 'Adjustment' }  // -100 - (-50) = -50
    ];
    expect(calculateBalance(transactions)).toBe(-50);
  });


  // --- Тести для getMonthlyCategorySummary ---

  test('6. getMonthlyCategorySummary: повинен повертати порожній об\'єкт для порожнього масиву', () => {
    expect(getMonthlyCategorySummary([], 4)).toEqual({});
  });

  test('7. getMonthlyCategorySummary: повинен фільтрувати транзакції строго за вказаним місяцем', () => {
    const transactions: Transaction[] = [
      { type: 'income', amount: 100, date: '2026-05-15', category: 'Salary' },   // Травень (індекс 4)
      { type: 'expense', amount: 30, date: '2026-06-15', category: 'Food' }      // Червень (індекс 5)
    ];
    // Шукаємо лише за травень (4)
    const result = getMonthlyCategorySummary(transactions, 4);
    expect(result).toHaveProperty('Salary', 100);
    expect(result).not.toHaveProperty('Food');
  });

  test('8. getMonthlyCategorySummary: повинен коректно групувати та сумувати дані в межах однієї категорії', () => {
    const transactions: Transaction[] = [
      { type: 'expense', amount: 15, date: '2026-05-01', category: 'Food' },
      { type: 'expense', amount: 25, date: '2026-05-02', category: 'Food' },
      { type: 'income', amount: 200, date: '2026-05-03', category: 'Salary' }
    ];
    const result = getMonthlyCategorySummary(transactions, 4);
    expect(result).toEqual({
      Food: 40,
      Salary: 200
    });
  });

  test('9. getMonthlyCategorySummary: повинен ігнорувати транзакції з некоректним форматом дати', () => {
    const transactions: Transaction[] = [
      { type: 'expense', amount: 50, date: 'invalid-date-string', category: 'Food' },
      { type: 'expense', amount: 30, date: '2026-05-10', category: 'Transport' }
    ];
    const result = getMonthlyCategorySummary(transactions, 4);
    expect(result).toEqual({ Transport: 30 });
  });
});
