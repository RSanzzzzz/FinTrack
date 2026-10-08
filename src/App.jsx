import { useEffect, useState } from "react"

import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import AddTransaction from "./pages/AddTransaction"
import Statistics from "./pages/Statistics"
import Settings from "./pages/Settings"
import CategoryManager from "./pages/CategoryManager"
import Backup from "./pages/Backup"
import AccountManager from "./pages/AccountManager"
import Transfer from "./pages/Transfer"
import AccountDetail from "./pages/AccountDetail"

import BottomNav from "./components/BottomNav"

// =========================
// INITIAL DATA
// =========================

const initialAccounts = [
  {
    id: "cash",
    name: "Cash",
    type: "cash",
    initialBalance: 0,
  },
]

const initialTransactions = [
  {
    id: 1,
    type: "expense",
    amount: 25000,
    category: "Makanan",
    note: "Makan siang",
    date: "2026-10-05",
    accountId: "cash",
  },
  {
    id: 2,
    type: "expense",
    amount: 15000,
    category: "Transportasi",
    note: "Ojek",
    date: "2026-10-05",
    accountId: "cash",
  },
  {
    id: 3,
    type: "income",
    amount: 6500000,
    category: "Gaji",
    note: "Gaji bulan Oktober",
    date: "2026-10-01",
    accountId: "cash",
  },
]

const initialCategories = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Hiburan",
  "Tagihan",
  "Kesehatan",
  "Pendidikan",
  "Gaji",
  "Lainnya",
]

function App() {
  const [activePage, setActivePage] = useState("dashboard")

  const [selectedAccountId, setSelectedAccountId] =
    useState(null)

  // =========================
  // ACCOUNTS
  // =========================

  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem("fintrack_accounts")

    if (savedAccounts) {
      return JSON.parse(savedAccounts)
    }

    return initialAccounts
  })

  useEffect(() => {
    localStorage.setItem(
      "fintrack_accounts",
      JSON.stringify(accounts)
    )
  }, [accounts])

  // =========================
  // TRANSFERS
  // =========================

  const [transfers, setTransfers] = useState(() => {
    const savedTransfers = localStorage.getItem(
      "fintrack_transfers"
    )

    if (savedTransfers) {
      return JSON.parse(savedTransfers)
    }

    return []
  })

  useEffect(() => {
    localStorage.setItem(
      "fintrack_transfers",
      JSON.stringify(transfers)
    )
  }, [transfers])

  // =========================
  // TRANSACTIONS
  // =========================

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem(
      "fintrack_transactions"
    )

    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions)

      // Transaksi FinTrack versi lama belum memiliki accountId.
      // Kita masukkan otomatis ke akun Cash.
      return parsedTransactions.map((transaction) => ({
        ...transaction,
        accountId: transaction.accountId || "cash",
      }))
    }

    return initialTransactions
  })

  useEffect(() => {
    localStorage.setItem(
      "fintrack_transactions",
      JSON.stringify(transactions)
    )
  }, [transactions])

  // =========================
  // CATEGORIES
  // =========================

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem(
      "fintrack_categories"
    )

    if (savedCategories) {
      return JSON.parse(savedCategories)
    }

    return initialCategories
  })

  useEffect(() => {
    localStorage.setItem(
      "fintrack_categories",
      JSON.stringify(categories)
    )
  }, [categories])

  // =========================
  // TRANSACTION FUNCTIONS
  // =========================

  const addTransaction = (newTransaction) => {
    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ])

    setActivePage("transactions")
  }

  const updateTransaction = (updatedTransaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    )

    setActivePage("transactions")
  }

  const deleteTransaction = (transactionId) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus transaksi ini?"
    )

    if (!confirmed) {
      return
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== transactionId
      )
    )
  }

  // =========================
  // CATEGORY FUNCTIONS
  // =========================

  const addCategory = (category) => {
    setCategories((currentCategories) => [
      ...currentCategories,
      category,
    ])
  }

  const deleteCategory = (categoryToDelete) => {
    const usedCount = transactions.filter(
      (transaction) => transaction.category === categoryToDelete
    ).length

    if (usedCount > 0) {
      alert(
        `Kategori "${categoryToDelete}" tidak dapat dihapus karena masih digunakan oleh ${usedCount} transaksi.`
      )

      return
    }

    const confirmed = window.confirm(
      `Hapus kategori "${categoryToDelete}"?`
    )

    if (!confirmed) {
      return
    }

    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => category !== categoryToDelete
      )
    )
  }

  // =========================
  // ACCOUNT FUNCTIONS
  // =========================

  const addAccount = (newAccount) => {
    setAccounts((currentAccounts) => [
      ...currentAccounts,
      newAccount,
    ])
  }

  const updateAccount = (updatedAccount) => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account.id === updatedAccount.id
          ? updatedAccount
          : account
      )
    )
  }

  const deleteAccount = (accountId) => {
    const account = accounts.find(
      (item) => item.id === accountId
    )
  
    if (!account) {
      return
    }
  
    const transactionCount = transactions.filter(
      (transaction) =>
        transaction.accountId === accountId
    ).length
  
    const transferCount = transfers.filter(
      (transfer) =>
        transfer.fromAccountId === accountId ||
        transfer.toAccountId === accountId
    ).length
  
    if (transactionCount > 0 || transferCount > 0) {
      let message = `Akun "${account.name}" tidak dapat dihapus karena masih memiliki riwayat.`
  
      if (transactionCount > 0) {
        message += `\n\nTransaksi: ${transactionCount}`
      }
  
      if (transferCount > 0) {
        message += `\nTransfer: ${transferCount}`
      }
  
      message +=
        "\n\nHapus transaksi atau transfer terkait terlebih dahulu."
  
      alert(message)
      return
    }
  
    if (accounts.length === 1) {
      alert("FinTrack harus memiliki minimal satu akun.")
      return
    }
  
    const confirmed = window.confirm(
      `Hapus akun "${account.name}"?`
    )
  
    if (!confirmed) {
      return
    }
  
    setAccounts((currentAccounts) =>
      currentAccounts.filter(
        (item) => item.id !== accountId
      )
    )
  }

  // =========================
  // TRANSFER FUNCTIONS
  // =========================

  const addTransfer = (newTransfer) => {
    setTransfers((currentTransfers) => [
      newTransfer,
      ...currentTransfers,
    ])

    setActivePage("dashboard")
  }

  const deleteTransfer = (transferId) => {
    const confirmed = window.confirm(
      "Hapus transfer ini?"
    )

    if (!confirmed) {
      return
    }

    setTransfers((currentTransfers) =>
      currentTransfers.filter(
        (transfer) => transfer.id !== transferId
      )
    )
  }

  const openAccountDetail = (accountId) => {
    setSelectedAccountId(accountId)
    setActivePage("accountDetail")
  }

  // =========================
  // RESTORE BACKUP
  // =========================

  const restoreData = (data) => {
    const restoredTransactions = data.transactions.map(
      (transaction) => ({
        ...transaction,
        accountId: transaction.accountId || "cash",
      })
    )

    setTransactions(restoredTransactions)
    setCategories(data.categories)

    if (
      Array.isArray(data.accounts) &&
      data.accounts.length > 0
    ) {
      setAccounts(data.accounts)
    } else {
      setAccounts(initialAccounts)
    }

    if (Array.isArray(data.transfers)) {
      setTransfers(data.transfers)
    } else {
      setTransfers([])
    }

    setActivePage("dashboard")
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="mx-auto max-w-md">
      {activePage === "dashboard" && (
        <Dashboard
          transactions={transactions}
          accounts={accounts}
          transfers={transfers}
          onOpenAccount={openAccountDetail}
        />
      )}

      {activePage === "transactions" && (
        <Transactions
          transactions={transactions}
          categories={categories}
          accounts={accounts}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={updateTransaction}
        />
      )}

      {activePage === "add" && (
        <AddTransaction
          categories={categories}
          accounts={accounts}
          onAddTransaction={addTransaction}
        />
      )}

      {activePage === "statistics" && (
        <Statistics
          transactions={transactions}
          accounts={accounts}
        />
      )}

      {activePage === "settings" && (
        <Settings setActivePage={setActivePage} />
      )}

      {activePage === "categories" && (
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onBack={() => setActivePage("settings")}
        />
      )}

      {activePage === "accounts" && (
        <AccountManager
          accounts={accounts}
          transactions={transactions}
          transfers={transfers}
          onAddAccount={addAccount}
          onUpdateAccount={updateAccount}
          onDeleteAccount={deleteAccount}
          onBack={() => setActivePage("settings")}
        />
      )}

      {activePage === "transfer" && (
        <Transfer
          accounts={accounts}
          transactions={transactions}
          transfers={transfers}
          onAddTransfer={addTransfer}
          onDeleteTransfer={deleteTransfer}
          onBack={() => setActivePage("settings")}
        />
      )}

      {activePage === "backup" && (
        <Backup
          transactions={transactions}
          categories={categories}
          accounts={accounts}
          transfers={transfers}
          onRestore={restoreData}
          onBack={() => setActivePage("settings")}
        />
      )}

      {activePage === "accountDetail" && (
        <AccountDetail
          account={accounts.find(
            (account) => account.id === selectedAccountId
          )}
          accounts={accounts}
          transactions={transactions}
          transfers={transfers}
          onBack={() => setActivePage("dashboard")}
        />
      )}

      <BottomNav
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </div>
  )
}

export default App