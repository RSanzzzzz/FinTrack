import { useState } from "react"

function Transfer({
    accounts,
    transactions,
    transfers,
    onAddTransfer,
    onDeleteTransfer,
    onBack,
}) {
    const getToday = () => {
        const now = new Date()

        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, "0")
        const day = String(now.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    const [fromAccountId, setFromAccountId] = useState(
        accounts[0]?.id || ""
    )

    const [toAccountId, setToAccountId] = useState(
        accounts[1]?.id || ""
    )

    const [amount, setAmount] = useState("")
    const [note, setNote] = useState("")
    const [date, setDate] = useState(getToday())

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID").format(value)
    }

    const getAccountName = (accountId) => {
        const account = accounts.find(
            (item) => item.id === accountId
        )

        return account?.name || "Akun"
    }

    const getAccountBalance = (accountId) => {
        const account = accounts.find(
            (item) => item.id === accountId
        )

        if (!account) {
            return 0
        }

        const accountTransactions = transactions.filter(
            (transaction) => transaction.accountId === accountId
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

        const transferIn = transfers
            .filter(
                (transfer) =>
                    transfer.toAccountId === accountId
            )
            .reduce(
                (total, transfer) =>
                    total + Number(transfer.amount),
                0
            )

        const transferOut = transfers
            .filter(
                (transfer) =>
                    transfer.fromAccountId === accountId
            )
            .reduce(
                (total, transfer) =>
                    total + Number(transfer.amount),
                0
            )

        return (
            Number(account.initialBalance || 0) +
            income -
            expense +
            transferIn -
            transferOut
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (accounts.length < 2) {
            alert("Tambahkan minimal 2 akun untuk melakukan transfer.")
            return
        }

        if (!fromAccountId || !toAccountId) {
            alert("Pilih akun asal dan akun tujuan.")
            return
        }

        if (fromAccountId === toAccountId) {
            alert("Akun asal dan akun tujuan tidak boleh sama.")
            return
        }

        if (!amount || Number(amount) <= 0) {
            alert("Masukkan jumlah transfer yang valid.")
            return
        }

        const transferAmount = Number(amount)
        const availableBalance = getAccountBalance(fromAccountId)

        if (transferAmount > availableBalance) {
            alert(
                `Saldo tidak cukup.\n\nSaldo tersedia: Rp ${formatRupiah(
                    availableBalance
                )}`
            )
            return
        }

        const newTransfer = {
            id: Date.now(),
            fromAccountId,
            toAccountId,
            amount: transferAmount,
            date,
            note: note.trim(),
        }

        onAddTransfer(newTransfer)
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
                        Transfer Antar Akun
                    </h1>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        Pindahkan saldo tanpa dihitung sebagai pemasukan atau pengeluaran
                    </p>
                </div>
            </div>

                {accounts.length < 2 ? (
                    <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm">
                        <div className="text-3xl">↔</div>

                        <p className="mt-3 font-semibold text-[var(--color-text-primary)]">
                            Minimal 2 akun diperlukan
                        </p>

                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            Tambahkan akun lain melalui Pengaturan → Kelola Akun.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >
                        {/* Dari Akun */}
                        <div>
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">
                                Dari Akun
                            </label>

                            <select
                                value={fromAccountId}
                                onChange={(e) =>
                                    setFromAccountId(e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
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
                            <div className="mt-2 flex items-center justify-between px-1">
                                <span className="text-xs text-[var(--color-text-secondary)]">
                                    Saldo tersedia
                                </span>

                                <span className="text-xs font-semibold text-[var(--color-primary)]">
                                    Rp {formatRupiah(getAccountBalance(fromAccountId))}
                                </span>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] font-bold text-[var(--color-primary)]">
                                ↓
                            </div>
                        </div>

                        {/* Ke Akun */}
                        <div>
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">
                                Ke Akun
                            </label>

                            <select
                                value={toAccountId}
                                onChange={(e) =>
                                    setToAccountId(e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
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
                            <div className="mt-2 flex items-center justify-between px-1">
                                <span className="text-xs text-[var(--color-text-secondary)]">
                                    Saldo saat ini
                                </span>

                                <span className="text-xs font-semibold text-[var(--color-primary)]">
                                    Rp {formatRupiah(getAccountBalance(toAccountId))}
                                </span>
                            </div>
                        </div>

                        {/* Jumlah */}
                        <div>
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">
                                Jumlah Transfer
                            </label>

                            <div className="mt-2 flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4">
                                <span className="font-medium text-[var(--color-text-secondary)]">
                                    Rp
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="0"
                                    className="w-full bg-transparent p-4 text-lg font-semibold text-[var(--color-text-primary)] outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Catatan */}
                        <div>
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">
                                Catatan
                            </label>

                            <textarea
                                value={note}
                                onChange={(e) =>
                                    setNote(e.target.value)
                                }
                                placeholder="Contoh: Top up DANA"
                                rows="3"
                                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
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
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text-primary)] outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[var(--color-primary)] p-4 font-semibold text-white shadow-sm"
                        >
                            Transfer Saldo
                        </button>
                    </form>
                )}

                {/* Transfer History */}
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        Riwayat Transfer
                    </h2>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        Perpindahan saldo antar akun
                    </p>

                    <div className="mt-4 space-y-3">
                        {transfers.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm">
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Belum ada transfer.
                                </p>
                            </div>
                        ) : (
                            transfers.map((transfer) => (
                                <div
                                    key={transfer.id}
                                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-[var(--color-text-primary)]">
                                                {getAccountName(
                                                    transfer.fromAccountId
                                                )}{" "}
                                                →{" "}
                                                {getAccountName(
                                                    transfer.toAccountId
                                                )}
                                            </p>

                                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                                {transfer.note || "Transfer saldo"}
                                            </p>

                                            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                                                {transfer.date}
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap font-semibold text-[var(--color-primary)]">
                                            Rp {formatRupiah(transfer.amount)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteTransfer(transfer.id)
                                        }
                                        className="mt-4 w-full border-t border-[var(--color-border)] pt-3 text-sm font-medium text-[var(--color-expense)]"
                                    >
                                        Hapus Transfer
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            )
}

            export default Transfer