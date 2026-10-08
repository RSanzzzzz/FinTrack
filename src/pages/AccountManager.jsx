import { useState } from "react"

const accountTypes = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "other", label: "Lainnya" },
]

function AccountManager({
  accounts,
  transactions,
  transfers,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onBack,
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState("bank")
  const [initialBalance, setInitialBalance] = useState("")

  const [editingAccountId, setEditingAccountId] =
    useState(null)

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getAccountBalance = (account) => {
    const accountTransactions = transactions.filter(
      (transaction) =>
        transaction.accountId === account.id
    )
  
    const transactionBalance =
      accountTransactions.reduce(
        (balance, transaction) => {
          if (transaction.type === "income") {
            return balance + Number(transaction.amount)
          }
  
          if (transaction.type === "expense") {
            return balance - Number(transaction.amount)
          }
  
          return balance
        },
        Number(account.initialBalance) || 0
      )
  
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
  
    return transactionBalance + transferIn - transferOut
  }

  const getAccountIcon = (accountType) => {
    if (accountType === "cash") return "💵"
    if (accountType === "bank") return "🏦"
    if (accountType === "ewallet") return "📱"

    return "💰"
  }

  const getAccountTypeLabel = (accountType) => {
    return (
      accountTypes.find(
        (item) => item.value === accountType
      )?.label || "Lainnya"
    )
  }

  const resetForm = () => {
    setName("")
    setType("bank")
    setInitialBalance("")
    setEditingAccountId(null)
  }

  const handleEdit = (account) => {
    setEditingAccountId(account.id)
    setName(account.name)
    setType(account.type)
    setInitialBalance(
      String(account.initialBalance || 0)
    )

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const cleanName = name.trim()

    if (!cleanName) {
      alert("Nama akun tidak boleh kosong.")
      return
    }

    const duplicate = accounts.some(
      (account) =>
        account.name.toLowerCase() ===
          cleanName.toLowerCase() &&
        account.id !== editingAccountId
    )

    if (duplicate) {
      alert("Nama akun sudah digunakan.")
      return
    }

    const balance = Number(initialBalance || 0)

    if (balance < 0) {
      alert("Saldo awal tidak boleh kurang dari 0.")
      return
    }

    if (editingAccountId) {
      const currentAccount = accounts.find(
        (account) =>
          account.id === editingAccountId
      )

      if (!currentAccount) {
        alert("Akun tidak ditemukan.")
        resetForm()
        return
      }

      onUpdateAccount({
        ...currentAccount,
        name: cleanName,
        type,
        initialBalance: balance,
      })

      resetForm()
      return
    }

    const newAccount = {
      id: `${type}-${Date.now()}`,
      name: cleanName,
      type,
      initialBalance: balance,
    }

    onAddAccount(newAccount)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-xl text-[var(--color-primary)] shadow-sm"
          aria-label="Kembali ke Pengaturan"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Kelola Akun
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Pisahkan uang berdasarkan tempat penyimpanannya
          </p>
        </div>
      </div>

      {/* Account List */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-text-primary)]">
            Akun Saya
          </h2>

          <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs text-[var(--color-text-secondary)] shadow-sm">
            {accounts.length} akun
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {accounts.map((account) => {
            const balance =
              getAccountBalance(account)

            const isEditing =
              editingAccountId === account.id

            return (
              <div
                key={account.id}
                className={`rounded-2xl border bg-[var(--color-card)] p-4 shadow-sm ${
                  isEditing
                    ? "border-[var(--color-primary)]"
                    : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-xl">
                    {getAccountIcon(account.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[var(--color-text-primary)]">
                      {account.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {getAccountTypeLabel(
                        account.type
                      )}
                    </p>
                  </div>

                  {isEditing && (
                    <span className="rounded-full bg-[var(--color-primary-light)] px-2 py-1 text-xs font-medium text-[var(--color-primary)]">
                      Diedit
                    </span>
                  )}
                </div>

                <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Saldo
                  </p>

                  <p
                    className={`mt-1 text-lg font-bold ${
                      balance < 0
                        ? "text-[var(--color-expense)]"
                        : "text-[var(--color-text-primary)]"
                    }`}
                  >
                    {formatRupiah(balance)}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Saldo awal{" "}
                    {formatRupiah(
                      account.initialBalance || 0
                    )}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(account)
                    }
                    className="rounded-xl bg-[var(--color-primary-light)] px-3 py-2 text-sm font-semibold text-[var(--color-primary)]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteAccount(account.id)
                    }
                    className="rounded-xl bg-[var(--color-expense-light)] px-3 py-2 text-sm font-semibold text-[var(--color-expense)]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[var(--color-text-primary)]">
              {editingAccountId
                ? "Edit Akun"
                : "Tambah Akun"}
            </h2>

            {editingAccountId && (
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                ID akun tetap sama sehingga transaksi
                dan transfer tidak terputus.
              </p>
            )}
          </div>

          {editingAccountId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Batal
            </button>
          )}
        </div>

        {/* Name */}
        <div className="mt-5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Nama Akun
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Contoh: BCA"
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-[var(--color-text-primary)] outline-none"
          />
        </div>

        {/* Type */}
        <div className="mt-4">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Jenis Akun
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-[var(--color-text-primary)] outline-none"
          >
            {accountTypes.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Initial Balance */}
        <div className="mt-4">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Saldo Awal
          </label>

          <div className="mt-2 flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4">
            <span className="text-[var(--color-text-secondary)]">
              Rp
            </span>

            <input
              type="number"
              min="0"
              value={initialBalance}
              onChange={(e) =>
                setInitialBalance(e.target.value)
              }
              placeholder="0"
              className="w-full bg-transparent p-4 text-[var(--color-text-primary)] outline-none"
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            {editingAccountId
              ? "Mengubah saldo awal akan langsung memengaruhi saldo akun saat ini."
              : "Masukkan saldo yang sudah ada di akun saat ini."}
          </p>
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-[var(--color-primary)] p-4 font-semibold text-white"
        >
          {editingAccountId
            ? "Simpan Perubahan"
            : "+ Tambah Akun"}
        </button>
      </form>
    </div>
  )
}

export default AccountManager