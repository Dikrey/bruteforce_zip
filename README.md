# ⚡ Hanz Cracker v2.0 - Ultimate Archive Blaster 🚀

**Hanz Cracker v2.0** adalah tool canggih berbasis web untuk melakukan bruteforce password file arsip terenkripsi (saat ini mendukung format `.zip`). Dengan antarmuka modern dan fitur lengkap, Anda dapat dengan mudah mengelola file, wordlist, serta menjalankan proses bruteforce langsung dari browser Anda.

---

## 🔐 Apa Itu Bruteforce?

Bruteforce adalah metode mencoba semua kemungkinan password secara otomatis dari sebuah daftar (wordlist) sampai menemukan yang cocok. Cocok untuk menguji kekuatan password atau melakukan pemulihan pada file arsip yang lupa password-nya.

---

## ✨ Fitur Unggulan

- 🔥 **Antarmuka Web Modern** — Responsif, interaktif, dan penuh animasi.
- 📦 **Dukungan File ZIP** — Fokus pada bruteforce untuk file `.zip`.
- 📁 **Manajemen File Arsip**
  - Upload file `.zip`
  - Lihat dan kelola daftar file
  - Hapus file (Admin)
  - Buat file ZIP terenkripsi untuk pengujian (Admin)
- 🔑 **Manajemen Wordlist**
  - Lihat isi `passhanz.txt`
  - Tambah/hapus password dari wordlist (Admin)
- ⚙️ **Bruteforce Real-time**
  - Progress bar real-time
  - Tampilkan password yang sedang diuji
  - Notifikasi saat password ditemukan
- 🌀 **Kontrol Animasi**
  - Atur kecepatan animasi: Normal | Cepat | Mati
- 🛡️ **Login Admin Sederhana**
  - Proteksi untuk fitur manajemen penting
- 📄 **Logging**
  - Catatan hasil bruteforce disimpan di `bruteforce_log.txt`

---

## 🚀 Cara Instalasi & Penggunaan

### 1️⃣ Clone Repositori

```bash
git clone https://github.com/Dikrey/bruteforce_zip.git
cd bruteforce_zip

2️⃣ Instal Dependensi

pip install -r requirements.txt

Pastikan file requirements.txt berisi:

Flask
tqdm
Werkzeug

3️⃣ Konfigurasi Admin (WAJIB)

Ubah kredensial admin di app.py atau melalui environment variables:

export HANZ_CRACKER_USER="admin_anda"
export HANZ_CRACKER_PASS="password_rahasia_anda"

4️⃣ Jalankan Aplikasi

python app.py

5️⃣ Akses di Browser

Buka:

http://127.0.0.1:5000 (lokal)

http://0.0.0.0:5000 (untuk akses via jaringan LAN)

```

---

📸 Screenshot

> 

---

🤝 Kontribusi

Proyek ini open-source dan terbuka untuk kontribusi!
Temukan bug? Punya ide baru? Silakan:

Buat issue

Kirim pull request



---

❤️ Dukungan

Jika Anda suka proyek ini, jangan lupa ⭐ repo-nya!
Selamat menggunakan Hanz Cracker v2.0 - Ultimate Archive Blaster! 💥


---
