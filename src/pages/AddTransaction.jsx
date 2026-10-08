import { useState } from "react"

function AddTransaction({
  onAddTransaction,
  categories,
  accounts,
}) {
  const [type, setType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState(categories[0] || "")
  const [accountId, setAccountId] = useState(accounts[0]?.id || "")
  const [note, setNote] = useState("")

  const getToday = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const [date, setDate] = useState(getToday())

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!accountId) {
      alert("Pilih akun terlebih dahulu.")
      return
    }

    if (!amount || Number(amount) <= 0) {
      alert("Masukkan jumlah transaksi yang valid.")
      return
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: Number(amount),
      accountId,
      category,
      note,
      date,
    }

    onAddTransaction(newTransaction)

    setAmount("")
    setNote("")
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Tambah Transaksi
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Catat pemasukan atau pengeluaranmu
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Jenis Transaksi */}
        <div>
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Jenis Transaksi
          </label>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`rounded-xl border p-4 font-semibold transition ${
                type === "expense"
                  ? "border-[var(--color-expense)] bg-[var(--color-expense-light)] text-[var(--color-expense)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)]"
              }`}
            >
              <span className="block text-xl">↑</span>
              <span className="mt-1 block">Pengeluaran</span>
            </button>

            <button
              type="button"
              onClick={() => setType("income")}
              className={`rounded-xl border p-4 font-semibold transition ${
                type === "income"
                  ? "border-[var(--color-income)] bg-[var(--color-income-light)] text-[var(--color-income)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)]"
              }`}
            >
              <span className="block text-xl">↓</span>
              <span className="mt-1 block">Pemasukan</span>
            </button>
          </div>
        </div>

        {/* Jumlah */}
        <div>
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Jumlah
          </label>

          <div className="mt-2 flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 shadow-sm">
            <span className="font-medium text-[var(--color-text-secondary)]">
              Rp
            </span>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent p-4 text-lg font-semibold text-[var(--color-text-primary)] outline-none"
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
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
            required
          >
            {accounts.length === 0 && (
              <option value="">Belum ada akun</option>
            )}

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Saldo akun ini akan diperbarui berdasarkan transaksi.
          </p>
        </div>

        {/* Kategori */}
        <div>
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Kategori
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Makan siang"
            rows="3"
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]"
          />
        </div>

        {/* Tanggal */}
        <div>
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Tanggal
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={accounts.length === 0}
          className="w-full rounded-xl bg-[var(--color-primary)] p-4 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Simpan Transaksi
        </button>
      </form>
    </div>
  )
}

export default AddTransaction