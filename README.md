# Hanz Cracker v2.0 - Ultimate Archive Blaster 🚀

Hanz Cracker v2.0 adalah sebuah tool canggih yang dirancang untuk membantu Anda menemukan password dari file arsip yang terenkripsi (saat ini mendukung format ZIP). Dengan antarmuka web modern dan intuitif, Anda dapat dengan mudah mengelola file, wordlist, dan meluncurkan serangan bruteforce langsung dari browser Anda.
Apa Itu Serangan Bruteforce?
Serangan Bruteforce adalah metode percobaan berulang kali di mana sistem akan mencoba setiap kombinasi password yang mungkin dari daftar yang telah ditentukan (wordlist) hingga menemukan password yang benar. Ini adalah metode yang paling sederhana namun seringkali efektif, terutama jika wordlist yang digunakan komprehensif atau password target relatif lemah. Hanz Cracker mengotomatiskan proses ini untuk file arsip Anda.
Fitur Unggulan 🌟
 * Antarmuka Web Modern: Nikmati pengalaman pengguna yang lancar dan intuitif dengan UI web yang responsif, keren, dan penuh animasi.
 * Dukungan File ZIP: Saat ini fokus pada pemecahan password untuk file arsip berekstensi .zip.
 * Manajemen File Arsip:
   * Upload File: Unggah file ZIP langsung dari perangkat Anda ke server.
   * Lihat Daftar File: Lihat semua file arsip yang tersedia di folder folderanda.
   * Hapus File (Admin): Hapus file arsip yang sudah diunggah untuk menjaga kebersihan.
   * Buat File ZIP Test (Admin): Buat file ZIP terenkripsi dengan password yang Anda tentukan sendiri, sangat berguna untuk pengujian dan pembelajaran.
 * Manajemen Wordlist:
   * Lihat Isi Wordlist: Periksa semua password yang akan dicoba dalam file passhanz.txt.
   * Tambah Password (Admin): Tambahkan password baru ke wordlist Anda.
   * Hapus Password (Admin): Hapus password yang tidak diperlukan dari wordlist.
 * Bruteforce Real-time:
   * Lihat progress bar dan password yang sedang dicoba secara real-time di browser.
   * Dapatkan notifikasi instan saat password ditemukan atau proses selesai.
 * Pengaturan Animasi: Sesuaikan kecepatan animasi untuk bruteforce (Normal, Cepat, Mati) sesuai preferensi Anda.
 * Sistem Admin Sederhana: Fitur-fitur sensitif (manajemen file, wordlist, dan keluar aplikasi) dilindungi oleh sistem login admin sederhana.
 * Logging: Hasil bruteforce disimpan dalam file log bruteforce_log.txt untuk referensi di kemudian hari.
Cara Memulai 🚀
 * Clone Repositori Ini:
   git clone https://github.com/Dikrey/bruteforce_zip.git
cd hanz-cracker-web

 * Instal Dependensi:
   pip install -r requirements.txt

   Pastikan requirements.txt berisi:
   Flask
tqdm
Werkzeug

 * Konfigurasi Admin (PENTING!):
   Ubah username dan password admin default di app.py, atau setel melalui environment variables (sangat direkomendasikan):
   export HANZ_CRACKER_USER="admin_anda"
export HANZ_CRACKER_PASS="password_rahasia_anda"

 * Jalankan Aplikasi:
   python app.py

 * Akses dari Browser:
   Buka browser Anda dan kunjungi http://127.0.0.1:5000 (atau http://0.0.0.0:5000 jika diakses dari perangkat lain di jaringan lokal).
Screenshot (Opsional, tapi sangat direkomendasikan!)
Tambahkan beberapa screenshot UI aplikasi Anda di sini untuk menarik perhatian!
Kontribusi & Dukungan 🙏
Proyek ini bersifat open source dan kami menyambut kontribusi dari siapa pun! Jika Anda menemukan bug atau memiliki ide fitur baru, silakan buka issue atau kirimkan pull request.
Selamat mencoba Hanz Cracker v2.0 - Ultimate Archive Blaster! 🚀
