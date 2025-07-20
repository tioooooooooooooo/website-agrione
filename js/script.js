
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
    event.target.classList.add('active');
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
  messageDiv.innerHTML = sender === 'user'
    ? `<strong>Anda:</strong> ${message}`
    : `<strong>AI Agronom:</strong> ${message}`;
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

  if (lowerMessage.includes('hama') || lowerMessage.includes('penyakit')) {
    return 'Untuk masalah hama dan penyakit tanaman, penting untuk melakukan identifikasi terlebih dahulu...';
  }

  if (lowerMessage.includes('pupuk') || lowerMessage.includes('nutrisi')) {
    return 'Jenis tanaman apa yang akan dipupuk? Saya bantu rekomendasinya.';
  }

  if (lowerMessage.includes('harga') || lowerMessage.includes('pasar')) {
    return 'Pantau juga harga di pasar lokal dan platform e-commerce.';
  }

  if (lowerMessage.includes('cuaca') || lowerMessage.includes('iklim')) {
    return 'Selalu cek prakiraan cuaca sebelum menanam.';
  }

  return chatResponses['default'];
}
  function showConsult(type) {
  document.querySelectorAll('.consult-box').forEach(box => box.classList.remove('active'));
  document.querySelectorAll('.consult-switcher button').forEach(btn => btn.classList.remove('active'));

  document.getElementById(`consult-${type}`).classList.add('active');
  document.querySelector(`.consult-switcher button[onclick="showConsult('${type}')"]`).classList.add('active');
}

// Logika metode pembayaran
function confirmPayment() {
  const selected = document.querySelector('.method.selected');
  if (selected) {
    const metode = selected.querySelector('span')?.innerText || "Metode tidak dikenal";
    alert("✅ Simulasi pembayaran berhasil via: " + metode);
  } else {
    alert("❗ Silakan pilih metode pembayaran terlebih dahulu.");
  }
}

// Highlight metode pembayaran yang dipilih
// KODE BARU YANG SUDAH LENGKAP - SALIN DAN TEMPEL INI
document.addEventListener('DOMContentLoaded', function () {

    // --- LOGIKA UNTUK HALAMAN PEMBAYARAN ---
    const methods = document.querySelectorAll('.method');
    const transferBankMethod = document.getElementById('transfer-bank-method');
    const bankOptionsList = document.getElementById('bank-options-list');

    // Pastikan elemen-elemen ini ada sebelum menambahkan listener
    if (methods.length > 0) {
        methods.forEach(method => {
            method.addEventListener('click', function () {
                // Hapus 'selected' dari semua metode
                methods.forEach(m => m.classList.remove('selected'));
                
                // Tambahkan 'selected' ke metode yang diklik
                this.classList.add('selected');

                // Logika untuk menampilkan/menyembunyikan pilihan bank
                if (this.id === 'transfer-bank-method' && bankOptionsList) {
                    // Jika klik Transfer Bank, tampilkan pilihan bank
                    bankOptionsList.classList.add('show');
                } else if (bankOptionsList) {
                    // Jika klik metode lain, sembunyikan pilihan bank
                    bankOptionsList.classList.remove('show');
                }
            });
        });
    }

    // --- LOGIKA UNTUK HALAMAN MARKETPLACE ---
    const productGrid = document.getElementById("productGrid");

    if (productGrid) {
        productGrid.addEventListener("click", function (e) {
            // Cek untuk tombol "Beli Sekarang"
            if (e.target && e.target.classList.contains("btn-beli")) {
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('.product-title').innerText;
                const productPrice = productCard.querySelector('.product-price').innerText;

                const productToBuy = {
                    name: productName,
                    price: productPrice
                };

                localStorage.setItem('checkoutProduct', JSON.stringify(productToBuy));
                window.location.href = "payment.html";
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
        <button class="cta-button" onclick="showSection('payment')">Beli Sekarang</button>
      </div>
    </div>
  `;

  const grid = document.getElementById('productGrid');
  grid.insertAdjacentHTML('beforeend', produkBaru);
  event.target.reset();
}