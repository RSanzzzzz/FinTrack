import { useState } from "react"

function Transactions({
  transactions,
  categories,
  accounts,
  onDeleteTransaction,
  onEditTransaction,
}) {
  const [filter, setFilter] = useState("all")
  const [accountFilter, setAccountFilter] = useState("all")
  const [editingTransaction, setEditingTransaction] = useState(null)

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID").format(number)
  }

  const formatDate = (date) => {
    if (!date) return "-"

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`))
  }

  const getAccountName = (accountId) => {
    const account = accounts.find(
      (item) => item.id === accountId
    )

    return account?.name || "Akun tidak ditemukan"
  }

  // =========================
  // FILTER
  // =========================

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      filter === "all" || transaction.type === filter

    const matchesAccount =
      accountFilter === "all" ||
      transaction.accountId === accountFilter

    return matchesType && matchesAccount
  })

  // =========================
  // EDIT
  // =========================

  const handleEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      accountId:
        transaction.accountId ||
        accounts[0]?.id ||
        "",
    })
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    if (!editingTransaction.accountId) {
      alert("Pilih akun terlebih dahulu.")
      return
    }

    if (
      !editingTransaction.amount ||
      Number(editingTransaction.amount) <= 0
    ) {
      alert("Jumlah transaksi harus lebih dari 0.")
      return
    }

    onEditTransaction({
      ...editingTransaction,
      amount: Number(editingTransaction.amount),
    })

    setEditingTransaction(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Transaksi
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Riwayat pemasukan dan pengeluaran
        </p>
      </div>

      {/* Filter Type */}
      <div className="mt-5 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-[var(--color-primary)] text-white"
              : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)]"
          }`}
        >
          Semua
        </button>

        <button
          type="button"
          onClick={() => setFilter("income")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "income"
              ? "bg-[var(--color-income)] text-white"
              : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)]"
          }`}
        >
          Pemasukan
        </button>

        <button
          type="button"
          onClick={() => setFilter("expense")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "expense"
              ? "bg-[var(--color-expense)] text-white"
              : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)]"
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Account Filter */}
      <div className="mt-4">
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">
          Filter berdasarkan akun
        </label>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm text-[var(--color-text-primary)] outline-none"
        >
          <option value="all">Semua Akun</option>

          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Total Transaksi
        </p>

        <p className="mt-1 text-xl font-bold text-[var(--color-text-primary)]">
          {filteredTransactions.length}
        </p>
      </div>

      {/* Transaction List */}
      <div className="mt-5 space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-xl text-[var(--color-primary)]">
              ▣
            </div>

            <p className="mt-4 text-sm font-medium text-[var(--color-text-primary)]">
              Belum ada transaksi
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Tidak ada transaksi yang sesuai dengan filter.
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                      transaction.type === "income"
                        ? "bg-[var(--color-income-light)] text-[var(--color-income)]"
                        : "bg-[var(--color-expense-light)] text-[var(--color-expense)]"
                    }`}
                  >
                    {transaction.type === "income" ? "↓" : "↑"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--color-text-primary)]">
                      {transaction.note || transaction.category}
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {transaction.category}
                    </p>

                    {/* Account Badge */}
                    <div className="mt-2">
                      <span className="inline-flex rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
                        {getAccountName(transaction.accountId)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <p
                  className={`whitespace-nowrap font-semibold ${
                    transaction.type === "income"
                      ? "text-[var(--color-income)]"
                      : "text-[var(--color-expense)]"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"} Rp{" "}
                  {formatRupiah(transaction.amount)}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-[var(--color-border)] pt-3">
                <button
                  type="button"
                  onClick={() => handleEdit(transaction)}
                  className="flex-1 rounded-lg bg-[var(--color-primary-light)] py-2 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80"
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteTransaction(transaction.id)
                  }
                  className="flex-1 rounded-lg bg-[var(--color-expense-light)] py-2 text-sm font-medium text-[var(--color-expense)] transition hover:opacity-80"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text-primary)]/50 px-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                Edit Transaksi
              </h2>

              <button
                type="button"
                onClick={() => setEditingTransaction(null)}
                className="text-xl text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="mt-5 space-y-4"
            >
              {/* Jenis */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Jenis
                </label>

                <select
                  value={editingTransaction.type}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      type: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-text-primary)] outline-none"
                >
                  <option value="expense">
                    Pengeluaran
                  </option>

                  <option value="income">
                    Pemasukan
                  </option>
                </select>
              </div>

              {/* Jumlah */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Jumlah
                </label>

                <div className="mt-2 flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Rp
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={editingTransaction.amount}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        amount: e.target.value,
                      })
                    }
                    className="w-full bg-transparent p-3 text-[var(--color-text-primary)] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Akun */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Akun
                </label>

                <select
                  value={editingTransaction.accountId}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      accountId: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-text-primary)] outline-none"
                  required
                >
                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kategori */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Kategori
                </label>

                <select
                  value={editingTransaction.category}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      category: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-text-primary)] outline-none"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catatan */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Catatan
                </label>

                <textarea
                  value={editingTransaction.note || ""}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      note: e.target.value,
                    })
                  }
                  rows="3"
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-text-primary)] outline-none"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)]">
                  Tanggal
                </label>

                <input
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      date: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-[var(--color-text-primary)] outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingTransaction(null)
                  }
                  className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 font-semibold text-[var(--color-text-secondary)]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[var(--color-primary)] p-3 font-semibold text-white transition hover:opacity-90"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions