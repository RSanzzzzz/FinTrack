function Settings({ setActivePage }) {
  const menuItems = [
    {
      id: "accounts",
      icon: "▣",
      title: "Kelola Akun",
      description: "Kelola Cash, Bank, E-Wallet, dan akun lainnya",
      action: () => setActivePage("accounts"),
    },
    {
      id: "transfer",
      icon: "↔",
      title: "Transfer Antar Akun",
      description: "Pindahkan saldo dari satu akun ke akun lainnya",
      action: () => setActivePage("transfer"),
    },
    {
      id: "categories",
      icon: "#",
      title: "Kelola Kategori",
      description: "Tambah atau hapus kategori transaksi",
      action: () => setActivePage("categories"),
    },
    {
      id: "backup",
      icon: "↕",
      title: "Backup & Restore",
      description: "Simpan atau pulihkan data FinTrack",
      action: () => setActivePage("backup"),
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 pb-24 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Pengaturan
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Kelola aplikasi dan data keuanganmu
        </p>
      </div>

      {/* App Card */}
      <div className="mt-6 rounded-3xl bg-[var(--color-primary)] p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-[var(--color-primary)]">
            F
          </div>

          <div>
            <h2 className="text-lg font-bold">
              FinTrack
            </h2>

            <p className="mt-1 text-sm text-white/70">
              Personal Finance Tracker
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-white/20 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">
              Versi aplikasi
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              v1.1.0
            </span>
          </div>
        </div>
      </div>

      {/* Data & App */}
      <div className="mt-6">
        <h2 className="px-1 text-sm font-semibold text-[var(--color-text-secondary)]">
          Data & Aplikasi
        </h2>

        <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-[var(--color-background)] ${
                index !== menuItems.length - 1
                  ? "border-b border-[var(--color-border)]"
                  : ""
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-lg font-semibold text-[var(--color-primary)]">
                {item.icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {item.description}
                </p>
              </div>

              <span className="text-xl text-[var(--color-text-secondary)]">
                ›
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="mt-6">
        <h2 className="px-1 text-sm font-semibold text-[var(--color-text-secondary)]">
          Tentang
        </h2>

        <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h3 className="font-bold text-[var(--color-text-primary)]">
            Tentang FinTrack
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            FinTrack adalah aplikasi pencatatan keuangan
            pribadi yang membantu mencatat pemasukan,
            pengeluaran, mengelola beberapa akun, kategori
            transaksi, dan memantau kondisi keuangan dengan
            lebih sederhana.
          </p>

          <div className="mt-5 border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Data tersimpan secara lokal pada perangkat.
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              FinTrack v1.1.0
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pb-4 text-center">
        <p className="text-xs text-[var(--color-text-secondary)]">
          Dibuat dengan React + Tailwind CSS
        </p>

        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          FinTrack © 2026
        </p>
      </div>
    </div>
  )
}

export default Settings