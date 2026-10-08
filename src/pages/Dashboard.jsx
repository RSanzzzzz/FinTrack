import { formatRupiah, formatDate } from "../utils/format"

function Dashboard({
  transactions,
  accounts,
  transfers,
  onOpenAccount,
}) {
  // =========================
  // ACCOUNT HELPERS
  // =========================

  const getAccountTransactions = (accountId) => {
    return transactions.filter(
      (transaction) => transaction.accountId === accountId
    )
  }

  const getAccountSummary = (account) => {
    const accountTransactions = getAccountTransactions(account.id)

    const income = accountTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      )

    const expense = accountTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      )

    const initialBalance = Number(account.initialBalance) || 0

    const transferIn = transfers
      .filter(
        (transfer) =>
          transfer.toAccountId === account.id
      )
      .reduce(
        (total, transfer) =>
          total + Number(transfer.amount),
        0
      )

    const transferOut = transfers
      .filter(
        (transfer) =>
          transfer.fromAccountId === account.id
      )
      .reduce(
        (total, transfer) =>
          total + Number(transfer.amount),
        0
      )

    return {
      income,
      expense,
      balance:
        initialBalance +
        income -
        expense +
        transferIn -
        transferOut,
    }
  }

  const getAccountIcon = (type) => {
    if (type === "cash") return "💵"
    if (type === "bank") return "🏦"
    if (type === "ewallet") return "📱"

    return "💰"
  }

  const getAccountTypeLabel = (type) => {
    if (type === "cash") return "Cash"
    if (type === "bank") return "Bank"
    if (type === "ewallet") return "E-Wallet"

    return "Lainnya"
  }

  const getAccountName = (accountId) => {
    const account = accounts.find(
      (item) => item.id === accountId
    )

    return account?.name || "Akun"
  }

  // =========================
  // GENERAL SUMMARY
  // =========================

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    )

  const latestTransactions = transactions.slice(0, 5)

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Selamat datang 👋
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
          FinTrack
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Pantau saldo setiap akun dengan lebih mudah
        </p>
      </div>

      {/* Accounts */}
      <div className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Akun Saya
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Saldo tersimpan secara terpisah
            </p>
          </div>

          <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
            {accounts.length} akun
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {accounts.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm">
              <p className="font-semibold text-[var(--color-text-primary)]">
                Belum ada akun
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Tambahkan akun melalui menu Pengaturan.
              </p>
            </div>
          ) : (
            accounts.map((account) => {
              const summary = getAccountSummary(account)

              return (
                <button
                  type="button"
                  key={account.id}
                  onClick={() => onOpenAccount(account.id)}
                  className="w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] text-left shadow-sm transition active:scale-[0.99]"
                >
                  <div className="p-4">
                    {/* Account Header */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-xl">
                        {getAccountIcon(account.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-[var(--color-text-primary)]">
                          {account.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                          {getAccountTypeLabel(account.type)}
                        </p>
                      </div>

                      <span className="text-xl text-[var(--color-text-secondary)]">
                        ›
                      </span>
                    </div>

                    {/* Balance */}
                    <div className="mt-4">
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Saldo
                      </p>

                      <p
                        className={`mt-1 text-2xl font-bold ${summary.balance < 0
                            ? "text-[var(--color-expense)]"
                            : "text-[var(--color-text-primary)]"
                          }`}
                      >
                        Rp {formatRupiah(summary.balance)}
                      </p>
                    </div>
                  </div>

                  {/* Income Expense */}
                  <div className="grid grid-cols-2 border-t border-[var(--color-border)]">
                    <div className="border-r border-[var(--color-border)] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-income-light)] text-xs text-[var(--color-income)]">
                          ↓
                        </span>

                        <span className="text-xs text-[var(--color-text-secondary)]">
                          Pemasukan
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-[var(--color-income)]">
                        + Rp {formatRupiah(summary.income)}
                      </p>
                    </div>

                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-expense-light)] text-xs text-[var(--color-expense)]">
                          ↑
                        </span>

                        <span className="text-xs text-[var(--color-text-secondary)]">
                          Pengeluaran
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-[var(--color-expense)]">
                        - Rp {formatRupiah(summary.expense)}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Overall Activity */}
      {
        transactions.length > 0 && (
          <div className="mt-7">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Aktivitas Keuangan
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Ringkasan transaksi seluruh akun
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* Income */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-income-light)] text-[var(--color-income)]">
                  ↓
                </div>

                <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                  Pemasukan
                </p>

                <p className="mt-1 text-base font-bold text-[var(--color-income)]">
                  Rp {formatRupiah(totalIncome)}
                </p>
              </div>

              {/* Expense */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-expense-light)] text-[var(--color-expense)]">
                  ↑
                </div>

                <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                  Pengeluaran
                </p>

                <p className="mt-1 text-base font-bold text-[var(--color-expense)]">
                  Rp {formatRupiah(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        )
      }

      {/* Latest Transactions */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Transaksi Terbaru
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Aktivitas keuangan terakhir
            </p>
          </div>

          <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
            {transactions.length} transaksi
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {latestTransactions.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Belum ada transaksi.
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Tambahkan transaksi pertamamu.
              </p>
            </div>
          ) : (
            latestTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${transaction.type === "income"
                    ? "bg-[var(--color-income-light)] text-[var(--color-income)]"
                    : "bg-[var(--color-expense-light)] text-[var(--color-expense)]"
                    }`}
                >
                  {transaction.type === "income" ? "↓" : "↑"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--color-text-primary)]">
                    {transaction.note || transaction.category}
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                    {transaction.category} •{" "}
                    {getAccountName(transaction.accountId)}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`whitespace-nowrap text-sm font-semibold ${transaction.type === "income"
                      ? "text-[var(--color-income)]"
                      : "text-[var(--color-expense)]"
                      }`}
                  >
                    {transaction.type === "income" ? "+" : "-"} Rp{" "}
                    {formatRupiah(transaction.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div >
  )
}

export default Dashboard