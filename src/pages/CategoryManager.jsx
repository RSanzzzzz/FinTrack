import { useState } from "react"

function CategoryManager({ categories, onAddCategory, onDeleteCategory, onBack }) {
  const [newCategory, setNewCategory] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const category = newCategory.trim()

    if (!category) return

    if (categories.includes(category)) {
      alert("Kategori tersebut sudah ada.")
      return
    }

    onAddCategory(category)
    setNewCategory("")
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
            Kategori
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Kelola kategori transaksi FinTrack
          </p>
        </div>
      </div>

        {/* Add Category */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
        >
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Tambah kategori
          </label>

          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Contoh: Kopi"
              className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]"
            />

            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-lg font-semibold text-white transition hover:opacity-90"
            >
              +
            </button>
          </div>
        </form>

        {/* Category List */}
        <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--color-text-primary)]">
              Daftar Kategori
            </h2>

            <span className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              {categories.length}
            </span>
          </div>

          <div className="mt-4 divide-y divide-[var(--color-border)]">
            {categories.length === 0 ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-lg font-semibold text-[var(--color-primary)]">
                  #
                </div>

                <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                  Belum ada kategori.
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Tambahkan kategori untuk digunakan pada transaksi.
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]">
                      #
                    </span>

                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {category}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteCategory(category)}
                    className="rounded-lg bg-[var(--color-expense-light)] px-3 py-2 text-xs font-medium text-[var(--color-expense)] transition hover:opacity-80"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      )
}

      export default CategoryManager