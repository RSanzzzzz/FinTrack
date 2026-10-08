export function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID").format(number)
  }
  
  export function formatDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }