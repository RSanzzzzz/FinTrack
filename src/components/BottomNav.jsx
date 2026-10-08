function BottomNav({ activePage, setActivePage }) {
  const menus = [
    { id: "dashboard", label: "Beranda", icon: "⌂" },
    { id: "transactions", label: "Transaksi", icon: "▣" },
    { id: "add", label: "Tambah", icon: "+" },
    { id: "statistics", label: "Statistik", icon: "◔" },
    { id: "settings", label: "Pengaturan", icon: "⚙" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {menus.map((menu) => {
          const isActive = activePage === menu.id

          return (
            <button
              key={menu.id}
              onClick={() => setActivePage(menu.id)}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition ${
                isActive
                  ? "font-semibold text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)]"
              }`}
            >
              <span
                className={`flex h-7 min-w-7 items-center justify-center rounded-lg text-xl ${
                  isActive
                    ? "bg-[var(--color-primary-light)]"
                    : ""
                }`}
              >
                {menu.icon}
              </span>

              <span>{menu.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav