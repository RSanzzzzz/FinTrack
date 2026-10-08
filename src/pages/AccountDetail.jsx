import { formatRupiah, formatDate } from "../utils/format"

function AccountDetail({
  account,
  transactions,
  transfers,
  accounts,
  onBack,
}) {
  if (!account) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-primary)]"
        >
          ← Kembali
        </button>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Akun tidak ditemukan.
          </p>
        </div>
      </div>
    )
  }

  const getAccountName = (accountId) => {
    return (
      accounts.find((item) => item.id === accountId)?.name ||
      "Akun"
    )
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

  // =========================
  // TRANSACTIONS
  // =========================

  const accountTransactions = transactions.filter(
    (transaction) => transaction.accountId === account.id
  )

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

  // =========================
  // TRANSFERS
  // =========================

  const transferIn = transfers
    .filter(
      (transfer) => transfer.toAccountId === account.id
    )
    .reduce(
      (total, transfer) =>
        total + Number(transfer.amount),
      0
    )

  const transferOut = transfers
    .filter(
      (transfer) => transfer.fromAccountId === account.id
    )
    .reduce(
      (total, transfer) =>
        total + Number(transfer.amount),
      0
    )

  const balance =
    Number(account.initialBalance || 0) +
    income -
    expense +
    transferIn -
    transferOut

  // =========================
  // ACTIVITY
  // =========================

  const transactionActivities = accountTransactions.map(
    (transaction) => ({
      id: `transaction-${transaction.id}`,
      originalId: transaction.id,
      activityType: "transaction",
      date: transaction.date,
      title:
        transaction.note ||
        transaction.category ||
        "Transaksi",
      subtitle: transaction.category,
      amount: Number(transaction.amount),
      direction:
        transaction.type === "income"
          ? "in"
          : "out",
    })
  )

  const transferActivities = transfers
    .filter(
      (transfer) =>
        transfer.fromAccountId === account.id ||
        transfer.toAccountId === account.id
    )
    .map((transfer) => {
      const isOutgoing =
        transfer.fromAccountId === account.id

      return {
        id: `transfer-${transfer.id}`,
        originalId: transfer.id,
        activityType: "transfer",
        date: transfer.date,
        title: isOutgoing
          ? `Transfer ke ${getAccountName(
              transfer.toAccountId
            )}`
          : `Transfer dari ${getAccountName(
              transfer.fromAccountId
            )}`,
        subtitle:
          transfer.note || "Transfer antar akun",
        amount: Number(transfer.amount),
        direction: isOutgoing ? "out" : "in",
      }
    })

  const activities = [
    ...transactionActivities,
    ...transferActivities,
  ].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)

    if (dateCompare !== 0) {
      return dateCompare
    }

    return b.originalId - a.originalId
  })

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-xl text-[var(--color-primary)] shadow-sm"
          aria-label="Kembali"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Detail Akun
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Aktivitas dan saldo akun
          </p>
        </div>
      </div>

      {/* Account Card */}
      <div className="mt-6 rounded-3xl bg-[var(--color-primary)] p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            {getAccountIcon(account.type)}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {account.name}
            </h2>

            <p className="mt-1 text-sm text-white/60">
              {getAccountTypeLabel(account.type)}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-white/20 pt-5">
          <p className="text-sm text-white/60">
            Saldo Saat Ini
          </p>

          <p className="mt-1 text-3xl font-bold">
            Rp {formatRupiah(balance)}
          </p>

          <p className="mt-2 text-xs text-white/50">
            Saldo awal Rp{" "}
            {formatRupiah(
              Number(account.initialBalance || 0)
            )}
          </p>
        </div>
      </div>

      {/* Income Expense */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-income-light)] text-[var(--color-income)]">
            ↓
          </div>

          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            Pemasukan
          </p>

          <p className="mt-1 font-bold text-[var(--color-income)]">
            Rp {formatRupiah(income)}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-expense-light)] text-[var(--color-expense)]">
            ↑
          </div>

          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            Pengeluaran
          </p>

          <p className="mt-1 font-bold text-[var(--color-expense)]">
            Rp {formatRupiah(expense)}
          </p>
        </div>
      </div>

      {/* Transfer Summary */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <p className="text-xs text-[var(--color-text-secondary)]">
            Transfer Masuk
          </p>

          <p className="mt-2 font-semibold text-[var(--color-primary)]">
            + Rp {formatRupiah(transferIn)}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <p className="text-xs text-[var(--color-text-secondary)]">
            Transfer Keluar
          </p>

          <p className="mt-2 font-semibold text-[var(--color-primary)]">
            - Rp {formatRupiah(transferOut)}
          </p>
        </div>
      </div>

      {/* Activities */}
      <div className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Aktivitas Akun
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Transaksi dan transfer
            </p>
          </div>

          <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs text-[var(--color-text-secondary)] shadow-sm">
            {activities.length} aktivitas
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {activities.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Belum ada aktivitas pada akun ini.
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    activity.activityType === "transfer"
                      ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : activity.direction === "in"
                        ? "bg-[var(--color-income-light)] text-[var(--color-income)]"
                        : "bg-[var(--color-expense-light)] text-[var(--color-expense)]"
                  }`}
                >
                  {activity.activityType === "transfer"
                    ? "↔"
                    : activity.direction === "in"
                      ? "↓"
                      : "↑"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--color-text-primary)]">
                    {activity.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                    {activity.subtitle}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {formatDate(activity.date)}
                  </p>
                </div>

                <p
                  className={`whitespace-nowrap text-sm font-semibold ${
                    activity.activityType === "transfer"
                      ? "text-[var(--color-primary)]"
                      : activity.direction === "in"
                        ? "text-[var(--color-income)]"
                        : "text-[var(--color-expense)]"
                  }`}
                >
                  {activity.direction === "in" ? "+" : "-"} Rp{" "}
                  {formatRupiah(activity.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountDetail