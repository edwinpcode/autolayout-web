// hardcode
const handleTitleAlert = (label, alert) => {
  if (alert) {
    return alert
  }
  if (['Pilih Aplikasi', 'Ajukan'].includes(label)) {
    return 'Apakah anda yakin ingin melanjutkan proses pengajuan?'
  } else {
    return 'Apakah anda yakin?'
  }
}

export const confirmSwal = (action, data, label, alert) => {
  window.Swal.fire({
    title: 'Informasi',
    text: handleTitleAlert(label, alert),
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      action(data)
    }
  })
}
