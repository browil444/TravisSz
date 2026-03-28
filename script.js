// Data state
let selectedProduct = null;
let selectedPayment = null;
let proofImage = null;

// DANA Info
const DANA_NUMBER = '082210475757';
const STORE_NAME = 'wildan ng****i';
const ADMIN_PHONE = '6282210475757';

// DOM Elements
const steps = {
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3')
};

const contents = {
    1: document.getElementById('content1'),
    2: document.getElementById('content2'),
    3: document.getElementById('content3')
};

// Show specific step
function showStep(step) {
    Object.values(contents).forEach(content => {
        if (content) content.style.display = 'none';
    });
    
    if (contents[step]) contents[step].style.display = 'block';
    
    for (let i = 1; i <= 3; i++) {
        if (steps[i]) {
            steps[i].classList.remove('active', 'completed');
            if (i < step) {
                steps[i].classList.add('completed');
            } else if (i === step) {
                steps[i].classList.add('active');
            }
        }
    }
}

// Format price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ========== STEP 1: Select Product ==========
const productButtons = document.querySelectorAll('.select-product');
const next1Btn = document.getElementById('next1');
const selectedProductSpan = document.getElementById('selectedProduct');

productButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseInt(card.getAttribute('data-price'));
        
        document.querySelectorAll('.product-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        card.classList.add('selected');
        selectedProduct = { id, name, price };
        
        if (selectedProductSpan) {
            selectedProductSpan.innerHTML = `${name} - Rp ${formatPrice(price)}`;
        }
        
        if (next1Btn) {
            next1Btn.disabled = false;
        }
    });
});

if (next1Btn) {
    next1Btn.addEventListener('click', () => {
        if (selectedProduct) {
            showStep(2);
        }
    });
}

// ========== STEP 2: Select Payment ==========
const paymentCards = document.querySelectorAll('.payment-card');
const next2Btn = document.getElementById('next2');
const prev2Btn = document.getElementById('prev2');
const selectedMethodSpan = document.getElementById('selectedMethod');

paymentCards.forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.payment-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        card.classList.add('selected');
        selectedPayment = card.getAttribute('data-method');
        
        if (selectedMethodSpan) {
            selectedMethodSpan.textContent = selectedPayment;
        }
        
        if (next2Btn) {
            next2Btn.disabled = false;
        }
    });
});

if (next2Btn) {
    next2Btn.addEventListener('click', () => {
        if (selectedPayment) {
            updateOrderSummary();
            updatePaymentInfo();
            showStep(3);
        }
    });
}

if (prev2Btn) {
    prev2Btn.addEventListener('click', () => {
        showStep(1);
    });
}

function updateOrderSummary() {
    const orderSummaryDiv = document.getElementById('orderSummary');
    const totalSpan = document.getElementById('totalAmount');
    
    if (orderSummaryDiv && selectedProduct) {
        orderSummaryDiv.innerHTML = `
            <div class="order-detail">
                <span>${selectedProduct.name}</span>
                <span>Rp ${formatPrice(selectedProduct.price)}</span>
            </div>
        `;
    }
    
    if (totalSpan && selectedProduct) {
        totalSpan.textContent = `Rp ${formatPrice(selectedProduct.price)}`;
    }
}

// Update payment info - QRIS dari gambar lokal
function updatePaymentInfo() {
    const paymentInfoDiv = document.getElementById('paymentInfo');
    if (!paymentInfoDiv) return;
    
    if (selectedPayment === 'DANA') {
        paymentInfoDiv.innerHTML = `
            <h3>Pembayaran via DANA</h3>
            <div class="payment-detail">
                <div class="number">${DANA_NUMBER}</div>
                <div class="name">a.n ${STORE_NAME}</div>
                <p style="font-size: 13px; color: #666; margin-top: 12px;">
                    Transfer ke nomor DANA di atas sesuai total pesanan
                </p>
            </div>
        `;
    } else if (selectedPayment === 'QRIS') {
        // QRIS dari gambar lokal - simpan file qris.jpg di folder yang sama
        paymentInfoDiv.innerHTML = `
            <h3>Scan QRIS</h3>
            <div class="payment-detail">
                <div class="qris-image" style="text-align: center;">
                    <img src="qris.jpeg" alt="QRIS" style="width: 200px; height: 200px; object-fit: contain; border-radius: 20px; margin: 0 auto; display: block; background: white; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <p style="font-size: 13px; color: #666; margin-top: 12px;">
                        Scan QRIS di atas untuk melakukan pembayaran
                    </p>
                </div>
            </div>
        `;
    }
}

// ========== STEP 3: Upload & Send ==========
const uploadArea = document.getElementById('uploadArea');
const proofInput = document.getElementById('proofImage');
const imagePreview = document.getElementById('imagePreview');
const prev3Btn = document.getElementById('prev3');
const sendOrderBtn = document.getElementById('sendOrder');

if (uploadArea && proofInput) {
    uploadArea.addEventListener('click', () => {
        proofInput.click();
    });
    
    proofInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB!');
                return;
            }
            
            proofImage = file;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                if (imagePreview) {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Bukti Transfer">`;
                }
                if (uploadArea) {
                    uploadArea.style.borderColor = '#c9a96e';
                    uploadArea.style.background = '#fffaf5';
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
            proofImage = null;
            if (uploadArea) {
                uploadArea.style.borderColor = '#e0d6c8';
                uploadArea.style.background = '#fefcf9';
            }
        }
    });
}

if (prev3Btn) {
    prev3Btn.addEventListener('click', () => {
        showStep(2);
    });
}

if (sendOrderBtn) {
    sendOrderBtn.addEventListener('click', () => {
        if (!selectedProduct) {
            alert('❌ Pilih produk terlebih dahulu!');
            return;
        }
        
        if (!selectedPayment) {
            alert('❌ Pilih metode pembayaran terlebih dahulu!');
            return;
        }
        
        if (!proofImage) {
            alert('❌ Harap upload bukti pembayaran terlebih dahulu!');
            return;
        }
        
        const total = selectedProduct.price;
        
        let message = "";
        message += "ORDER BARU - JASTEB TRAVIS%0A";
        message += "%0A";
        message += "================================%0A";
        message += "DETAIL PESANAN:%0A";
        message += "================================%0A";
        message += "Produk: " + selectedProduct.name + "%0A";
        message += "Harga: Rp " + formatPrice(selectedProduct.price) + "%0A";
        message += "Total: Rp " + formatPrice(total) + "%0A";
        message += "Metode Pembayaran: " + selectedPayment + "%0A";
        message += "%0A";
        message += "================================%0A";
        message += "INSTRUKSI:%0A";
        message += "SILAKAN KIRIM BUKTI TRANSFER MELALUI CHAT INI%0A";
        message += "%0A";
        message += "Terima kasih sudah berbelanja!%0A";
        message += "Jasteb Travis";
        
        const whatsappUrl = "https://wa.me/" + ADMIN_PHONE + "?text=" + message;
        window.open(whatsappUrl, '_blank');
        
        alert('✅ PESANAN DITERIMA!\n\n' +
              'LANGKAH SELANJUTNYA:\n' +
              '1️⃣ WhatsApp akan terbuka\n' +
              '2️⃣ Kirimkan BUKTI TRANSFER yang sudah kamu upload\n' +
              '3️⃣ Admin akan memproses pesananmu\n\n' +
              '📸 Bukti transfer sudah siap di galeri HP');
        
        setTimeout(() => {
            if (confirm('📸 Apakah sudah mengirim bukti transfer?\n\nKlik OK jika sudah mengirim')) {
                if (confirm('🔄 Ingin memesan lagi?')) {
                    resetOrder();
                }
            }
        }, 3000);
    });
}

function resetOrder() {
    selectedProduct = null;
    selectedPayment = null;
    proofImage = null;
    
    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
    if (selectedProductSpan) {
        selectedProductSpan.innerHTML = 'Belum ada produk';
    }
    if (next1Btn) {
        next1Btn.disabled = true;
    }
    
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
    if (selectedMethodSpan) {
        selectedMethodSpan.textContent = '-';
    }
    if (next2Btn) {
        next2Btn.disabled = true;
    }
    
    if (proofInput) proofInput.value = '';
    if (imagePreview) imagePreview.innerHTML = '';
    if (uploadArea) {
        uploadArea.style.borderColor = '#e0d6c8';
        uploadArea.style.background = '#fefcf9';
    }
    
    showStep(1);
}

// ========== FLOATING WHATSAPP (Langsung ke WA tanpa teks) ==========
const waFloat = document.getElementById('waFloat');
if (waFloat) {
    waFloat.addEventListener('click', () => {
        window.open(`https://wa.me/${ADMIN_PHONE}`, '_blank');
    });
}

// Initial step
showStep(1);