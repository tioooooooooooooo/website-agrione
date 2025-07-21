// Toggle Menu Mobile
function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('show');
}

// Navigasi Section
function showSection(sectionId, event = null) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    try {
        if (event && event.target) {
            event.target.classList.add('active');
        }
    } catch (e) {}
}

// Filter produk marketplace
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card, .card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Chatbot AI Agronom
const chatResponses = {
    'kapan waktu terbaik untuk menanam padi': 'Waktu terbaik menanam padi adalah pada musim hujan (Oktober-Maret)...',
    'bagaimana cara mengatasi hama wereng': 'Untuk mengatasi hama wereng: gunakan varietas tahan, tanam serempak...',
    'pupuk apa yang bagus untuk jagung': 'Gunakan NPK 15:15:15 saat tanam, dan Urea di minggu ke 3 dan 6.',
    'berapa harga jual tomat saat ini': 'Harga tomat di pasaran berkisar Rp 8.000–12.000/kg tergantung lokasi.',
    'default': 'Terima kasih atas pertanyaan Anda! Coba ajukan topik lebih spesifik.'
};

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message === '') return;
    addMessage(message, 'user');
    setTimeout(() => {
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 1000);
    userInput.value = '';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendQuickMessage(message) {
    addMessage(message, 'user');
    setTimeout(() => {
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = sender === 'user' ?
        `<strong>Anda:</strong> ${message}` :
        `<strong>AI Agronom:</strong> ${message}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(chatResponses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
            return response;
        }
    }
    // ... (sisa logika generateResponse Anda) ...
    return chatResponses['default'];
}

function showConsult(type) {
    document.querySelectorAll('.consult-box').forEach(box => box.classList.remove('active'));
    document.querySelectorAll('.consult-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`consult-${type}`).classList.add('active');
    document.querySelector(`.consult-switcher button[onclick="showConsult('${type}')"]`).classList.add('active');
}

// Logika metode pembayaran
// GANTI FUNGSI LAMA DENGAN YANG INI
function confirmPayment() {
    const selectedMethod = document.querySelector('.method.selected');

    // Jika tidak ada metode yang dipilih
    if (!selectedMethod) {
        alert("❗ Silakan pilih metode pembayaran terlebih dahulu.");
        return;
    }

    // Jika yang dipilih adalah Transfer Bank
    if (selectedMethod.id === 'transfer-bank-method') {
        const selectedBankRadio = document.querySelector('input[name="bank"]:checked');

        if (!selectedBankRadio) {
            alert("❗ Silakan pilih bank terlebih dahulu.");
            return;
        }

        const bankValue = selectedBankRadio.value;
        // Simulasi pembuatan nomor VA
        const vaNumber = '8808' + Math.floor(1000000000 + Math.random() * 9000000000);

        // Sembunyikan tampilan pilihan metode
        document.querySelector('.container').style.display = 'none';
        
        // Tampilkan tampilan instruksi
        const instructionsEl = document.getElementById('payment-instructions');
        instructionsEl.style.display = 'block';

        // Isi data dinamis
        document.getElementById('selected-bank-name').innerText = bankValue;
        document.getElementById('va-number-display').innerText = vaNumber;

        // Tampilkan instruksi yang sesuai dengan bank
        document.querySelectorAll('.instructions-steps > div').forEach(div => div.style.display = 'none');
        document.getElementById(`${bankValue}-steps`).style.display = 'block';

    } else {
        // Logika untuk metode pembayaran lain (tetap menggunakan alert)
        const metode = selectedMethod.querySelector('div').innerText;
        alert("✅ Simulasi pembayaran berhasil via: " + metode);
    }
}

// BARU: Fungsi untuk menyalin nomor VA
function copyVA() {
    const vaNumber = document.getElementById('va-number-display').innerText;
    navigator.clipboard.writeText(vaNumber).then(() => {
        alert("Nomor Virtual Account berhasil disalin!");
    }).catch(err => {
        alert("Gagal menyalin. Coba lagi.");
    });
}

// Event Listener Utama yang berjalan setelah halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    // --- LOGIKA BARU UNTUK KALENDER INTERAKTIF (BISA DIEDIT) ---

    // Variabel global untuk menyimpan data & status kalender
    let farmEvents = {
        '2025-07-22': [
            { time: '08:00', title: 'Pemupukan Lahan C' }
        ],
        '2025-07-28': [
            { time: '09:00', title: 'Panen Jagung' },
            { time: '14:00', title: 'Penyemprotan Hama' }
        ]
    };
    let currentDate = new Date(2025, 6, 21);
    let selectedDateStr = null;

    // Mengambil elemen-elemen dari DOM
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearEl = document.getElementById('month-year');
    const eventDateEl = document.getElementById('event-date');
    const eventDetailsEl = document.getElementById('event-details');
    const addEventBtn = document.getElementById('add-event-btn');
    const dashboardJadwalList = document.getElementById('dashboard-jadwal-list');

    // Fungsi untuk menampilkan jadwal di kartu dashboard
    function renderDashboardCard() {
        if (!dashboardJadwalList) return;

        const today = new Date(2025, 6, 21); // Simulasi hari ini
        const upcomingEvents = [];

        // Cari event yang akan datang
        const sortedDates = Object.keys(farmEvents).sort();
        for (const dateStr of sortedDates) {
            if (new Date(dateStr) >= today) {
                farmEvents[dateStr].forEach(event => {
                    upcomingEvents.push({ date: dateStr, ...event });
                });
            }
        }

        // Tampilkan 2 jadwal terdekat
        dashboardJadwalList.innerHTML = '';
        if (upcomingEvents.length > 0) {
            upcomingEvents.slice(0, 2).forEach(event => {
                const date = new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                dashboardJadwalList.innerHTML += `<li><strong>${date}:</strong> ${event.title}</li>`;
            });
        } else {
            dashboardJadwalList.innerHTML = '<li>Tidak ada jadwal terdekat.</li>';
        }
    }


    // Fungsi untuk menampilkan detail event di panel
    function renderEventPanel(dateStr) {
        selectedDateStr = dateStr;
        const date = new Date(dateStr);
        eventDateEl.textContent = `Jadwal untuk ${date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`;
        
        if (farmEvents[dateStr]) {
            let eventsHTML = '<ul>';
            farmEvents[dateStr].forEach((event, index) => {
                eventsHTML += `<li>${event.time}: ${event.title} <button class="delete-event-btn" data-index="${index}">×</button></li>`;
            });
            eventsHTML += '</ul>';
            eventDetailsEl.innerHTML = eventsHTML;
        } else {
            eventDetailsEl.innerHTML = '<p>Tidak ada jadwal untuk tanggal ini.</p>';
        }
        addEventBtn.style.display = 'block'; // Tampilkan tombol tambah
    }

    // Fungsi utama untuk merender seluruh kalender
    function renderCalendar() {
        if (!calendarGrid) return;
        renderDashboardCard(); // Update kartu dashboard setiap kali kalender di-render ulang
        
        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearEl.textContent = new Date(year, month).toLocaleString('id-ID', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) { calendarGrid.innerHTML += `<div class="day other-month"></div>`; }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.textContent = day;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (farmEvents[dateStr]) { dayEl.classList.add('event'); }
            if (dateStr === selectedDateStr) { dayEl.classList.add('selected'); }

            dayEl.addEventListener('click', () => {
                document.querySelectorAll('.day.selected').forEach(d => d.classList.remove('selected'));
                dayEl.classList.add('selected');
                renderEventPanel(dateStr);
            });
            calendarGrid.appendChild(dayEl);
        }
    }

    // Fungsi untuk menambah event
    function addEvent() {
        if (!selectedDateStr) {
            alert("Pilih tanggal terlebih dahulu!");
            return;
        }
        const time = prompt("Masukkan waktu kegiatan (contoh: 09:00):");
        if (!time) return;
        const title = prompt("Masukkan nama kegiatan:");
        if (!title) return;

        if (!farmEvents[selectedDateStr]) {
            farmEvents[selectedDateStr] = [];
        }
        farmEvents[selectedDateStr].push({ time, title });
        renderCalendar();
        renderEventPanel(selectedDateStr);
    }

    // Fungsi untuk menghapus event
    function deleteEvent(eventIndex) {
        if (!selectedDateStr || !farmEvents[selectedDateStr]) return;
        
        farmEvents[selectedDateStr].splice(eventIndex, 1);
        if (farmEvents[selectedDateStr].length === 0) {
            delete farmEvents[selectedDateStr];
        }
        renderCalendar();
        renderEventPanel(selectedDateStr);
    }


    // Menjalankan semua fungsi saat halaman dimuat
    if(document.getElementById('calendar-grid')) {
        renderCalendar();
        
        document.getElementById('prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        addEventBtn.addEventListener('click', addEvent);

        // Event listener untuk tombol hapus (event delegation)
        eventDetailsEl.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('delete-event-btn')) {
                const eventIndex = e.target.dataset.index;
                if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
                    deleteEvent(eventIndex);
                }
            }
        });
    }
    
    // --- LOGIKA UNTUK HALAMAN PEMBAYARAN ---
    const methods = document.querySelectorAll('.method');
    const transferBankMethod = document.getElementById('transfer-bank-method');
    const bankOptionsList = document.getElementById('bank-options-list');

    if (methods.length > 0) {
        methods.forEach(method => {
            method.addEventListener('click', function () {
                methods.forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');

                if (this.id === 'transfer-bank-method' && bankOptionsList) {
                    bankOptionsList.classList.add('show');
                } else if (bankOptionsList) {
                    bankOptionsList.classList.remove('show');
                }
            });
        });
    }

    // --- LOGIKA UNTUK TOMBOL "BELI SEKARANG" DI MARKETPLACE ---
    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
        productGrid.addEventListener("click", function (e) {
            if (e.target && e.target.classList.contains("btn-beli")) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('.product-title').innerText;
                    const productPrice = productCard.querySelector('.product-price').innerText;
                    const productToBuy = { name: productName, price: productPrice };
                    localStorage.setItem('checkoutProduct', JSON.stringify(productToBuy));
                    window.location.href = "payment.html";
                }
            }
        });
    }
    
    // --- LOGIKA UNTUK MENAMPILKAN DETAIL PRODUK DI HALAMAN PEMBAYARAN ---
    const detailsContainer = document.getElementById('product-details');
    if (detailsContainer) {
        const product = JSON.parse(localStorage.getItem('checkoutProduct'));
        if (product) {
            detailsContainer.innerHTML = `
                <p><strong>Produk:</strong> ${product.name}</p>
                <p><strong>Harga:</strong> ${product.price}</p>
            `;
        } else {
            detailsContainer.innerHTML = `<p>Tidak ada produk yang dipilih.</p>`;
        }
    }

});

function tambahProduk(event) {
    event.preventDefault();
    const nama = document.getElementById('namaProduk').value;
    const harga = document.getElementById('hargaProduk').value;
    const stok = document.getElementById('stokProduk').value;
    const deskripsi = document.getElementById('deskripsiProduk').value;
    const petani = document.getElementById('petaniProduk').value;
    const satuan = document.getElementById('satuanProduk').value;
    const gambarInput = document.getElementById('gambarProduk');
    const file = gambarInput.files[0];
    const imageURL = URL.createObjectURL(file);

    const produkBaru = `
    <div class="product-card">
      <div class="product-image" style="background-image: url('${imageURL}');"></div>
      <div class="product-info">
        <h3 class="product-title">${nama}</h3>
        <p class="product-price">Rp ${parseInt(harga).toLocaleString('id-ID')}/${satuan}</p>
        <p class="product-farmer">Petani: ${petani}</p>
        <p class="product-desc">${deskripsi}</p>
        <p class="product-stock"><strong>Stok:</strong> ${stok}</p>
        <button class="cta-button btn-beli">Beli Sekarang</button>
        <button class="cta-button" onclick="window.location.href='https://wa.me/6281563812202'">Hubungi Penjual</button>
      </div>
    </div>
  `;

    const grid = document.getElementById('productGrid');
    grid.insertAdjacentHTML('beforeend', produkBaru);
    event.target.reset();
}

// Fungsi untuk Kartu Jadwal Kegiatan
function tambahKegiatan() {
    const kegiatanBaru = prompt("Masukkan kegiatan baru:");
    if (kegiatanBaru) {
        const list = document.getElementById('kegiatan-list');
        const newItem = document.createElement('li');
        newItem.textContent = kegiatanBaru;
        list.appendChild(newItem);
    }
}

// Fungsi untuk Kartu Rekomendasi
function toggleRekomendasi() {
    const detail = document.getElementById('rekomendasi-detail');
    detail.classList.toggle('show');
}

// Fungsi untuk Kartu Peringatan
function tandaiDibaca(tombol) {
    const card = tombol.closest('.card-peringatan');
    card.classList.add('acknowledged');
    tombol.textContent = 'Sudah Dibaca';
    tombol.disabled = true;
}