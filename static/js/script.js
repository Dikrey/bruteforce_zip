
let isAdminLoggedIn = false;
let currentAnimSpeed = 'normal'
function updateCurrentTime() {
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('current-time').textContent = formattedTime.replace(',', '');
}

updateCurrentTime();
setInterval(updateCurrentTime, 1000);

function displayStatusMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.className = `status-message ${type}`;
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.status-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.output').forEach(el => el.textContent = '');
    document.getElementById('bruteforce-result').classList.add('hidden');

    if (sectionId === 'bruteforce-section') {
        fetchUploadedFiles();
    } else if (sectionId === 'folder-section') {
        listFolderFiles();
    }
    // For wordlist-section, user needs to click "Lihat Isi Wordlist" explicitly
}


document.addEventListener('DOMContentLoaded', () => {
    checkAdminStatus();
    showSection('bruteforce-section');

    const animSpeedSelect = document.getElementById('animSpeed');
    const initialAnimSpeed = animSpeedSelect ? animSpeedSelect.value : 'normal';
    currentAnimSpeed = initialAnimSpeed; 
});

// --- Admin Login/Logout ---
async function checkAdminStatus() {
    try {
        const response = await fetch('/status');
        const data = await response.json();
        isAdminLoggedIn = data.logged_in;
        updateAdminUI();
    } catch (error) {
        console.error('Error checking admin status:', error);
        isAdminLoggedIn = false;
        updateAdminUI();
    }
}

function updateAdminUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminOnlySections = document.querySelectorAll('.admin-only');

    if (isAdminLoggedIn) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        adminOnlySections.forEach(section => section.style.display = 'block');
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        adminOnlySections.forEach(section => section.style.display = 'none');
    }
}

function showLogin() {
    document.getElementById('loginModal').style.display = 'flex'; // Use flex to center modal
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    displayStatusMessage('loginStatus', '', '');
}

function hideLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

async function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    displayStatusMessage('loginStatus', 'Mencoba login...', 'info');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.status === 'success') {
            isAdminLoggedIn = true;
            displayStatusMessage('loginStatus', data.message, 'success');
            setTimeout(() => {
                hideLogin();
                updateAdminUI();
            }, 1000);
        } else {
            displayStatusMessage('loginStatus', data.message, 'error');
            isAdminLoggedIn = false;
        }
    } catch (error) {
        displayStatusMessage('loginStatus', `Error login: ${error.message}`, 'error');
        isAdminLoggedIn = false;
    }
}

async function logoutAdmin() {
    if (!confirm('Anda yakin ingin logout dari sesi admin?')) {
        return;
    }
    try {
        const response = await fetch('/logout', { method: 'POST' });
        const data = await response.json();
        if (data.status === 'success') {
            alert(data.message);
            isAdminLoggedIn = false;
            updateAdminUI();
        } else {
            alert('Gagal logout: ' + data.message);
        }
    } catch (error) {
        alert('Error logout: ' + error.message);
    }
}

// --- File Management & Bruteforce ---
async function uploadFile() {
    const fileInput = document.getElementById('zipFile');
    const file = fileInput.files[0];
    
    if (!file) {
        displayStatusMessage('upload-status', 'Pilih file terlebih dahulu!', 'error');
        return;
    }
    if (!file.name.toLowerCase().endsWith('.zip')) {
        displayStatusMessage('upload-status', 'Hanya file .zip yang didukung saat ini!', 'error');
        return;
    }

    displayStatusMessage('upload-status', 'Mengunggah...', 'info');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (data.status === 'success') {
            displayStatusMessage('upload-status', data.message, 'success');
            fetchUploadedFiles();
        } else {
            displayStatusMessage('upload-status', `Error: ${data.message}`, 'error');
        }
    } catch (error) {
        displayStatusMessage('upload-status', `Error mengunggah: ${error.message}`, 'error');
    }
}

async function fetchUploadedFiles() {
    const fileSelect = document.getElementById('fileSelect');
    const fileToDeleteSelect = document.getElementById('fileToDeleteSelect');
    
    fileSelect.innerHTML = '<option value="">Pilih file ZIP...</option>';
    fileToDeleteSelect.innerHTML = '<option value="">Pilih file untuk dihapus...</option>';

    try {
        const response = await fetch('/files');
        const data = await response.json();
        if (data.files && data.files.length > 0) {
            data.files.forEach(file => {
                const optionSelect = document.createElement('option');
                optionSelect.value = file;
                optionSelect.textContent = file;
                fileSelect.appendChild(optionSelect);

                const optionDelete = document.createElement('option');
                optionDelete.value = file;
                optionDelete.textContent = file;
                fileToDeleteSelect.appendChild(optionDelete);
            });
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Tidak ada file ZIP terunggah.";
            fileSelect.appendChild(option);
            fileToDeleteSelect.appendChild(option.cloneNode(true));
        }
        updateSelectedFile();
    } catch (error) {
        console.error('Error fetching files:', error);
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Gagal memuat daftar file.";
        fileSelect.appendChild(option);
        fileToDeleteSelect.appendChild(option.cloneNode(true));
    }
}

function updateSelectedFile() {
    const fileSelect = document.getElementById('fileSelect');
    const selectedFileInfo = document.getElementById('selected-file-info');
    const selectedFileName = fileSelect.value;
    if (selectedFileName) {
        selectedFileInfo.textContent = `File terpilih: ${selectedFileName}`;
        selectedFileInfo.className = 'info-text';
    } else {
        selectedFileInfo.textContent = 'Pilih file dari daftar di atas.';
        selectedFileInfo.className = 'info-text';
    }
}

async function startBruteforce() {
    const fileSelect = document.getElementById('fileSelect');
    const selectedFileName = fileSelect.value;
    const bruteforceOutput = document.getElementById('bruteforce-output');
    const bruteforceResult = document.getElementById('bruteforce-result');
    const bruteforceBtn = document.getElementById('bruteforceBtn');

    if (!selectedFileName) {
        alert('Mohon pilih file ZIP terlebih dahulu!');
        return;
    }

    bruteforceOutput.textContent = '';
    bruteforceOutput.style.color = '#92b0c9';
    bruteforceResult.classList.add('hidden');
    bruteforceBtn.disabled = true;
    bruteforceBtn.textContent = 'Mulai Bruteforce (Sedang Berjalan...)';
    bruteforceBtn.classList.add('loading');

    try {
        const response = await fetch('/bruteforce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_name: selectedFileName,
                anim_speed: currentAnimSpeed // Use the stored animation speed
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            lines.forEach(line => {
                if (line.startsWith('data:')) {
                    let message = line.substring(5);
                    const cleanMessage = message.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI color codes

                    if (cleanMessage.startsWith('PROGRESS:')) {
                        bruteforceOutput.textContent = cleanMessage.substring('PROGRESS:'.length);
                    } else if (cleanMessage.startsWith('RESULT:')) {
                        const resultParts = cleanMessage.substring('RESULT:'.length).split(':');
                        const status = resultParts[0];
                        const password = resultParts[1];
                        const time = resultParts[2];
                        const tried = resultParts[3];

                        bruteforceResult.classList.remove('hidden');
                        bruteforceResult.classList.remove('success', 'failed');

                        if (status === 'SUCCESS') {
                            bruteforceResult.classList.add('success');
                            bruteforceResult.innerHTML = `
                                🎉 Password Ditemukan: <span class="found-password">${password}</span><br>
                                ⏱ Waktu: ${time} detik | Dicoba: ${tried} password
                            `;
                        } else if (status === 'FAILED') {
                            bruteforceResult.classList.add('failed');
                            bruteforceResult.innerHTML = `
                                [!] Password Tidak Ditemukan!<br>
                                ⏱ Waktu: ${time} detik | Dicoba: ${tried} password
                            `;
                        }
                        bruteforceOutput.textContent = '';
                    } else if (cleanMessage.startsWith('INFO:')) {
                        bruteforceOutput.textContent += cleanMessage.substring('INFO:'.length) + '\n';
                    } else if (cleanMessage.startsWith('ERROR_FATAL:')) {
                        bruteforceOutput.textContent += `\n${cleanMessage.substring('ERROR_FATAL:'.length)}`;
                        bruteforceOutput.style.color = 'red';
                    } else if (cleanMessage.startsWith('ERROR_DETAIL:')) {
                        bruteforceOutput.textContent += `\n${cleanMessage.substring('ERROR_DETAIL:'.length)}`;
                        bruteforceOutput.style.color = 'orange';
                    } else if (cleanMessage.startsWith('ERROR:')) {
                        bruteforceOutput.textContent += `\n${cleanMessage.substring('ERROR:'.length)}`;
                        bruteforceOutput.style.color = 'red';
                    } else {
                        bruteforceOutput.textContent += cleanMessage + '\n';
                    }
                    bruteforceOutput.scrollTop = bruteforceOutput.scrollHeight;
                }
            });
        }
    } catch (error) {
        bruteforceOutput.textContent += `\nError komunikasi: ${error.message}`;
        bruteforceOutput.style.color = 'red';
    } finally {
        bruteforceBtn.disabled = false;
        bruteforceBtn.textContent = 'Mulai Bruteforce';
        bruteforceBtn.classList.remove('loading');
    }
}

async function deleteSelectedFile() {
    if (!isAdminLoggedIn) {
        alert('Anda harus login sebagai Admin untuk menghapus file.');
        showLogin();
        return;
    }
    const fileToDeleteSelect = document.getElementById('fileToDeleteSelect');
    const selectedFileName = fileToDeleteSelect.value;
    if (!selectedFileName) {
        alert('Pilih file yang ingin dihapus!');
        return;
    }
    if (!confirm(`Anda yakin ingin menghapus file "${selectedFileName}"?`)) {
        return;
    }

    try {
        const response = await fetch('/files/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file_name: selectedFileName })
        });
        const data = await response.json();
        alert(data.message);
        if (data.status === 'success') {
            listFolderFiles();
            fetchUploadedFiles();
        }
    } catch (error) {
        alert('Gagal menghapus file: ' + error.message);
    }
}

async function createTestZip() {
    if (!isAdminLoggedIn) {
        alert('Anda harus login sebagai Admin untuk membuat file ZIP test.');
        showLogin();
        return;
    }
    const testZipName = document.getElementById('testZipName').value.trim();
    const testZipPassword = document.getElementById('testZipPassword').value.trim();
    const createTestZipStatus = document.getElementById('createTestZipStatus');

    if (!testZipName || !testZipPassword) {
        displayStatusMessage('createTestZipStatus', 'Nama ZIP dan password test tidak boleh kosong!', 'error');
        return;
    }
    if (!testZipName.toLowerCase().endsWith('.zip')) {
        displayStatusMessage('createTestZipStatus', 'Nama file ZIP harus berakhir dengan .zip!', 'error');
        return;
    }

    displayStatusMessage('createTestZipStatus', 'Membuat ZIP test...', 'info');

    try {
        const response = await fetch('/files/create_test_zip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zip_name: testZipName, test_password: testZipPassword })
        });
        const data = await response.json();
        if (data.status === 'success') {
            displayStatusMessage('createTestZipStatus', data.message, 'success');
            listFolderFiles();
            fetchUploadedFiles();
        } else {
            displayStatusMessage('createTestZipStatus', `Error: ${data.message}`, 'error');
        }
    } catch (error) {
        displayStatusMessage('createTestZipStatus', `Error membuat ZIP test: ${error.message}`, 'error');
    }
}


async function addPassword() {
    if (!isAdminLoggedIn) {
        alert('Anda harus login sebagai Admin untuk menambah password.');
        showLogin();
        return;
    }
    const newPasswordInput = document.getElementById('newPassword');
    const newPassword = newPasswordInput.value.trim();
    if (!newPassword) {
        alert('Password tidak boleh kosong!');
        return;
    }

    try {
        const response = await fetch('/wordlist/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword })
        });
        const data = await response.json();
        alert(data.message);
        newPasswordInput.value = '';
        viewWordlist();
    } catch (error) {
        alert('Gagal menambahkan password: ' + error.message);
    }
}

async function removePassword() {
    if (!isAdminLoggedIn) {
        alert('Anda harus login sebagai Admin untuk menghapus password.');
        showLogin();
        return;
    }
    const passwordToRemoveInput = document.getElementById('passwordToRemove');
    const passwordToRemove = passwordToRemoveInput.value.trim();
    if (!passwordToRemove) {
        alert('Masukkan password yang ingin dihapus!');
        return;
    }

    if (!confirm(`Anda yakin ingin menghapus password "${passwordToRemove}"?`)) {
        return;
    }

    try {
        const response = await fetch('/wordlist/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordToRemove })
        });
        const data = await response.json();
        alert(data.message);
        passwordToRemoveInput.value = '';
        viewWordlist();
    } catch (error) {
        alert('Gagal menghapus password: ' + error.message);
    }
}

async function viewWordlist() {
    const wordlistOutput = document.getElementById('wordlist-output');
    wordlistOutput.textContent = 'Memuat wordlist...';
    wordlistOutput.style.color = '#c9d1d9';
    try {
        const response = await fetch('/wordlist');
        const data = await response.json();
        if (data.passwords && data.passwords.length > 0) {
            wordlistOutput.textContent = data.passwords.map((pwd, index) => `[${index + 1}] ${pwd}`).join('\n');
            wordlistOutput.style.color = '#c9d1d9';
        } else {
            wordlistOutput.textContent = 'Wordlist kosong.';
            wordlistOutput.style.color = '#ffc107';
        }
    } catch (error) {
        wordlistOutput.textContent = 'Gagal memuat wordlist: ' + error.message;
        wordlistOutput.style.color = 'red';
    }
}
async function listFolderFiles() {
    const folderFilesList = document.getElementById('folder-files');
    const fileToDeleteSelect = document.getElementById('fileToDeleteSelect');
    
    folderFilesList.innerHTML = '<li class="info-text">Memuat file...</li>';
    fileToDeleteSelect.innerHTML = '<option value="">Pilih file untuk dihapus...</option>';

    try {
        const response = await fetch('/files');
        const data = await response.json();
        folderFilesList.innerHTML = '';
        if (data.files && data.files.length > 0) {
            data.files.forEach(file => {
                const listItem = document.createElement('li');
                listItem.textContent = file;
                folderFilesList.appendChild(listItem);

                const optionDelete = document.createElement('option');
                optionDelete.value = file;
                optionDelete.textContent = file;
                fileToDeleteSelect.appendChild(optionDelete);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Tidak ada file di folder "folderanda".';
            listItem.className = 'info-text';
            folderFilesList.appendChild(listItem);
        }
    } catch (error) {
        folderFilesList.innerHTML = `<li class="error-text">Gagal memuat daftar file: ${error.message}</li>`;
        folderFilesList.style.color = 'red';
    }
}

// --- Animasi Settings ---
async function saveAnimSpeed() {
    const animSpeedSelect = document.getElementById('animSpeed');
    const selectedSpeed = animSpeedSelect.value;

    try {
        const response = await fetch('/settings/anim_speed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ speed: selectedSpeed })
        });
        const data = await response.json();
        alert(data.message);
        currentAnimSpeed = selectedSpeed;
    } catch (error) {
        alert('Gagal menyimpan kecepatan animasi: ' + error.message);
    }
}

function exitApp() {
    if (!isAdminLoggedIn) {
        alert('Anda harus login sebagai Admin untuk menghentikan aplikasi.');
        showLogin();
        return;
    }
    if (confirm("Anda yakin ingin menghentikan server Flask? Ini akan mematikan aplikasi.")) {
        fetch('/exit', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                alert(data.message + "\nAnda mungkin perlu menutup jendela terminal secara manual.");
            })
            .catch(error => {
                alert('Gagal mengirim perintah berhenti: ' + error.message + '\nHarap hentikan server secara manual di terminal (Ctrl+C).');
            });
    }
}
