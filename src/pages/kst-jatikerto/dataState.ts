export function getJatikertoDataMessage(input: {
  isLoading: boolean;
  error: string | null;
  errorStatus?: number | null;
  hasItems: boolean;
}) {
  if (input.isLoading) return null;
  if (input.errorStatus === 403) return "Anda tidak memiliki akses untuk melihat data ini.";
  if (input.errorStatus === 404) return "Data tidak ditemukan";
  if (input.errorStatus === 503) return "Data belum dapat ditampilkan. Silakan coba beberapa saat lagi.";
  if (input.error) return "Sebagian data berhasil ditampilkan, namun beberapa informasi belum tersedia.";
  if (!input.hasItems) return "Data belum tersedia";
  return null;
}
