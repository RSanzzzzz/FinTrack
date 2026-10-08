import { useRef } from "react"

function Backup({
  transactions,
  categories,
  accounts,
  transfers,
  onRestore,
  onBack,
}) {
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const backupData = {
      app: "FinTrack",
      version: 2,
      exportedAt: new Date().toISOString(),
  
      accounts,
      transactions,
      categories,
      transfers,
    }
  
    const json = JSON.stringify(backupData, null, 2)
  
    const blob = new Blob([json], {
      type: "application/json",
    })
  
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
  
    link.href = url
    link.download = `fintrack-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result

        if (typeof text !== "string") {
          alert("File backup tidak dapat dibaca sebagai teks.")
          return
        }

        console.log("Isi file backup:", text)

        const data = JSON.parse(text)

        if (!data || typeof data !== "object") {
          alert("Format file backup tidak valid.")
          return
        }
        
        if (!Array.isArray(data.transactions)) {
          alert("Data transaksi di file backup tidak valid.")
          return
        }
        
        if (!Array.isArray(data.categories)) {
          alert("Data kategori di file backup tidak valid.")
          return
        }
        
        const backupAccounts = Array.isArray(data.accounts)
          ? data.accounts
          : []
        
        const backupTransfers = Array.isArray(data.transfers)
          ? data.transfers
          : []
        
        const isOldBackup = backupAccounts.length === 0
        
        let message = "Pulihkan backup FinTrack ini?"
        
        message += `\n\nTransaksi: ${data.transactions.length}`
        message += `\nKategori: ${data.categories.length}`
        
        if (!isOldBackup) {
          message += `\nAkun: ${backupAccounts.length}`
        }
        
        message += `\nTransfer: ${backupTransfers.length}`
        
        if (isOldBackup) {
          message +=
            "\n\nBackup lama terdeteksi. Transaksi lama akan dimasukkan ke akun Cash."
        }
        
        message +=
          "\n\nData FinTrack saat ini akan diganti dengan data dari backup."
        
        const confirmed = window.confirm(message)
        
        if (!confirmed) {
          return
        }
        
        onRestore({
          transactions: data.transactions,
          categories: data.categories,
          accounts:
            backupAccounts.length > 0
              ? backupAccounts
              : undefined,
          transfers: backupTransfers,
        })
        
        alert("Data berhasil dipulihkan.")

        if (!data || typeof data !== "object") {
          alert("Format file backup tidak valid.")
          return
        }

        if (!Array.isArray(data.transactions)) {
          alert("Data transaksi di file backup tidak valid.")
          return
        }

        if (!Array.isArray(data.categories)) {
          alert("Data kategori di file backup tidak valid.")
          return
        }

      } catch (error) {
        console.error("Restore error:", error)

        alert(
          "File backup tidak dapat dibaca. Pastikan file berasal dari FinTrack."
        )
      }
    }

    reader.onerror = () => {
      alert("Terjadi kesalahan saat membaca file.")
    }

    reader.readAsText(file)

    e.target.value = ""
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
            Backup & Restore
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Simpan atau pulihkan data FinTrack
          </p>
        </div>
      </div>

      {/* Export */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-income-light)] text-xl text-[var(--color-income)]">
            📥
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-[var(--color-text-primary)]">
              Export Data
            </h2>

            <p className="mt-1 text-sm leading-5 text-[var(--color-text-secondary)]">
              Simpan transaksi dan kategori ke dalam file
              backup.
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="mt-5 w-full rounded-xl bg-[var(--color-primary)] p-3 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Export Backup
        </button>
      </div>

      {/* Import */}
      <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-xl text-[var(--color-primary)]">
            📤
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-[var(--color-text-primary)]">
              Restore Data
            </h2>

            <p className="mt-1 text-sm leading-5 text-[var(--color-text-secondary)]">
              Pulihkan data FinTrack dari file backup JSON.
            </p>
          </div>
        </div>

        <button
          onClick={handleImportClick}
          className="mt-5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-light)] p-3 font-semibold text-[var(--color-primary)] transition hover:opacity-80"
        >
          Pilih File Backup
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Current Data */}
      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]">
            ✓
          </div>

          <h2 className="font-bold text-[var(--color-text-primary)]">
            Data Saat Ini
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Transaksi
            </span>

            <span className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-sm font-semibold text-[var(--color-primary)]">
              {transactions.length}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Kategori
            </span>

            <span className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-sm font-semibold text-[var(--color-primary)]">
              {categories.length}
            </span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-5 rounded-2xl border border-[var(--color-expense-light)] bg-[var(--color-expense-light)] p-4">
        <p className="text-sm font-semibold text-[var(--color-expense)]">
          ⚠️ Perhatian
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
          Restore backup akan mengganti transaksi dan kategori
          yang sedang tersimpan di FinTrack.
        </p>
      </div>
    </div>
  )
}

export default Backup