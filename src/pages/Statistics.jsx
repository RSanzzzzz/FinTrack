import { useState } from "react"
import { formatRupiah } from "../utils/format"

function Statistics({ transactions, accounts }) {
  const [accountFilter, setAccountFilter] = useState("all")

  // =========================
  // FILTER ACCOUNT
  // =========================

  const filteredTransactions =
    accountFilter === "all"
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.accountId === accountFilter
        )

  const selectedAccount =
    accountFilter === "all"
      ? null
      : accounts.find(
          (account) => account.id === accountFilter
        )

  // =========================
  // SUMMARY
  // =========================

  const income = filteredTransactions
    .filter(
      (transaction) => transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )

  const expense = filteredTransactions
    .filter(
      (transaction) => transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )

  const difference = income - expense

  // =========================
  // CATEGORY TOTALS
  // =========================

  const categoryTotals = filteredTransactions
    .filter(
      (transaction) => transaction.type === "expense"
    )
    .reduce((result, transaction) => {
      if (!result[transaction.category]) {
        result[transaction.category] = 0
      }

      result[transaction.category] += Number(
        transaction.amount
      )

      return result
    }, {})

  const categories = Object.entries(categoryTotals)

  const highestExpense = Math.max(
    ...categories.map(([, amount]) => amount),
    0
  )

  const totalExpense = categories.reduce(
    (total, [, amount]) => total + amount,
    0
  )

  const highestCategory =
    categories.length > 0
      ? categories.reduce((highest, current) =>
          current[1] > highest[1]
            ? current
            : highest
        )
      : null

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Statistik
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Pantau kondisi keuanganmu
        </p>
      </div>

      {/* Account Filter */}
      <div className="mt-6">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Akun
        </label>

        <select
          value={accountFilter}
          onChange={(e) =>
            setAccountFilter(e.target.value)
          }
          className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
        >
          <option value="all">Semua Akun</option>

          {accounts.map((account) => (
            <option
              key={account.id}
              value={account.id}
            >
              {account.name}
            </option>
          ))}
        </select>

        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {accountFilter === "all"
            ? "Menampilkan transaksi dari seluruh akun."
            : `Menampilkan transaksi dari akun ${
                selectedAccount?.name || ""
              }.`}
        </p>
      </div>

      {/* Difference */}
      <div className="mt-5 rounded-3xl bg-[var(--color-primary)] p-6 text-white shadow-lg">
        <p className="text-sm text-white/70">
          Selisih Pemasukan & Pengeluaran
        </p>

        <p className="mt-2 text-3xl font-bold">
          {difference < 0 ? "- " : ""}
          Rp {formatRupiah(Math.abs(difference))}
        </p>

        <div className="mt-5 border-t border-white/20 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">
                Statistik
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {accountFilter === "all"
                  ? "Semua Akun"
                  : selectedAccount?.name}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/60">
                Transaksi
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {filteredTransactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Income Expense */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-income-light)] text-[var(--color-income)]">
            ↓
          </div>

          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Pemasukan
          </p>

          <p className="mt-2 font-bold text-[var(--color-income)]">
            Rp {formatRupiah(income)}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-expense-light)] text-[var(--color-expense)]">
            ↑
          </div>

          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Pengeluaran
          </p>

          <p className="mt-2 font-bold text-[var(--color-expense)]">
            Rp {formatRupiah(expense)}
          </p>
        </div>
      </div>

      {/* Highest Expense */}
      {highestCategory && (
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-expense-light)] text-[var(--color-expense)]">
              ↑
            </div>

            <div className="min-w-0">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Pengeluaran terbesar
              </p>

              <p className="mt-1 truncate text-lg font-bold text-[var(--color-text-primary)]">
                {highestCategory[0]}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-[var(--color-expense)]">
            Rp {formatRupiah(highestCategory[1])}
          </p>
        </div>
      )}

      {/* Category Chart */}
      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div>
          <h2 className="font-bold text-[var(--color-text-primary)]">
            Pengeluaran berdasarkan kategori
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {accountFilter === "all"
              ? "Perbandingan pengeluaran seluruh akun"
              : `Perbandingan pengeluaran ${
                  selectedAccount?.name || ""
                }`}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              ◔
            </div>

            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Belum ada data pengeluaran.
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Tidak ada pengeluaran untuk akun yang dipilih.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {[...categories]
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage =
                  totalExpense > 0
                    ? (amount / totalExpense) * 100
                    : 0

                const barWidth =
                  highestExpense > 0
                    ? (amount / highestExpense) * 100
                    : 0

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                          {category}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                          {percentage.toFixed(1)}% dari
                          total
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-sm font-semibold text-[var(--color-text-primary)]">
                        Rp {formatRupiah(amount)}
                      </p>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--color-primary-light)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-highlight)] transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Total transaksi
            </p>

            <p className="mt-1 text-xl font-bold text-[var(--color-text-primary)]">
              {filteredTransactions.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Total pengeluaran
            </p>

            <p className="mt-1 text-xl font-bold text-[var(--color-expense)]">
              Rp {formatRupiah(totalExpense)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics