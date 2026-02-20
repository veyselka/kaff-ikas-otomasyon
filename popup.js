/**
 * ===================================================================
 * POPUP.JS - User Interface Logic
 * ===================================================================
 * 
 * Bu dosya, popup.html'deki butonlara olay (event) listener ekler
 * ve content script ile iletişim kurar.
 * 
 * İLETİŞİM MİMARİSİ:
 * ------------------
 * [Kullanıcı] → [popup.html] → [popup.js] 
 *                                   ↓ chrome.tabs.sendMessage
 *                              [content.js] → DOM işlemleri
 * 
 * @author Kıdemli Yazılım Mimarı
 */

// ===================================================================
// CACHE CONTROL - VERSION CHECK
// ===================================================================
console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║  🔥 POPUP.JS - VERSION 2.0.0 (Nur Teması)               ║");
console.log("║  📅 Yüklenme: " + new Date().toLocaleTimeString() + "                              ║");
console.log("╚════════════════════════════════════════════════════════════╝");

// ===================================================================
// WOW FEATURES - DARK MODE, SOUND, CONFETTI
// ===================================================================

let soundEnabled = true;
let isProcessRunning = false; // İşlem çalışıyor mu?

/**
 * Stop butonu görünürlüğünü kontrol et
 */
function toggleStopButton(show) {
    const stopBtn = document.getElementById('btn-stop');
    stopBtn.style.display = show ? 'block' : 'none';
    isProcessRunning = show;
}

/**
 * Dark Mode Toggle
 */
function initTheme() {
    const savedTheme = localStorage.getItem('kaff-theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('kaff-theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
    playSound('click');
}

/**
 * Sound Toggle
 */
function initSound() {
    const savedSound = localStorage.getItem('kaff-sound') || 'enabled';
    soundEnabled = savedSound === 'enabled';
    updateSoundButton();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('kaff-sound', soundEnabled ? 'enabled' : 'disabled');
    updateSoundButton();
    if (soundEnabled) playSound('click');
}

function updateSoundButton() {
    const btn = document.getElementById('sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !soundEnabled);
}

/**
 * Ses Çalma Fonksiyonu (Web Audio API)
 * @param {string} type - 'success', 'error', 'click'
 */
function playSound(type) {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Ses tipine göre frekans ve süre
        switch(type) {
            case 'success':
                // Yüksek, mutlu ses (ding!)
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            case 'error':
                // Düşük, uyarı sesi (buzz!)
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'click':
                // Kısa tıklama sesi
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
        }
    } catch (error) {
        console.warn('Ses çalınamadı:', error);
    }
}

/**
 * Konfeti Animasyonu 🎉
 */
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas boyutunu ayarla
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    // 50 konfeti parçacığı oluştur
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 4 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let stillAnimating = false;
        
        particles.forEach(p => {
            if (p.y < canvas.height) {
                stillAnimating = true;
                
                // Parçacığı çiz
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctx.restore();
                
                // Pozisyonu güncelle
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 5;
                p.speedY += 0.1; // Yerçekimi
            }
        });
        
        if (stillAnimating) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Dosya boyutu kontrol sabitleri
 */
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 10MB

/**
 * Dosya boyutunu insan okunabilir formata çevirir
 * @param {number} bytes - Byte cinsinden boyut
 * @returns {string} - Formatlanmış boyut (örn: "2.5 MB")
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Sonuç mesajını gösterir (ses + konfeti ile)
 * @param {string} message - Mesaj metni
 * @param {string} type - 'success' veya 'error'
 */
function showResult(message, type = 'success') {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = `result ${type}`;
    
    // Ses çal
    playSound(type);
    
    // Başarı ise konfeti
    if (type === 'success') {
        launchConfetti();
    }
    
    // 5 saniye sonra gizle
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

/**
 * Loading state'i aktif eder
 * @param {HTMLButtonElement} button - Buton elementi
 * @param {boolean} isLoading - Loading durumu
 */
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span>⏳</span><span>İşleniyor...</span>';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Seçilen klasörden gelen görsel payload'ı
let selectedImagesPayload = null;

// Retry state yönetimi
let lastFailedRequest = null;
const MAX_RETRY_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 30000; // 30 saniye

// Klasör seçiminden payload hazırlar
async function buildImagesPayload(fileList) {
    const files = Array.from(fileList || []).filter(f => /\.jpe?g$/i.test(f.name));

    if (files.length === 0) {
        selectedImagesPayload = null;
        document.getElementById('folder-status').textContent = '⚠️ Klasörde .jpg dosya bulunamadı';
        return;
    }

    const grouped = new Map();

    for (const file of files) {
        const rel = file.webkitRelativePath || file.name;
        const parts = rel.split(/[\\/]/);
        // Root klasör / model klasörü / dosya -> model klasörünü al
        const folder = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
        if (!folder) continue;
        if (!grouped.has(folder)) grouped.set(folder, []);
        grouped.get(folder).push(file);
    }

    const payload = [];
    let totalFiles = 0;

    console.log('📂 Dosya okuma başladı...');

    for (const [folder, list] of grouped.entries()) {
        console.log(`  📁 "${folder}" klasöründen ${list.length} dosya okunuyor...`);
        
        // Büyük dosya ve hatalı dosya sayıları
        const skippedFiles = [];
        
        const fileEntries = await Promise.all(list.map(async f => {
            console.log(`     📄 "${f.name}" okunuyor... (${formatFileSize(f.size)})`);
            
            // EDGE CASE 1: Büyük dosya kontrolü (>10MB)
            if (f.size > MAX_FILE_SIZE_BYTES) {
                console.warn(`     ⚠️ "${f.name}" çok büyük (${formatFileSize(f.size)}), atlanıyor!`);
                skippedFiles.push({ name: f.name, reason: `Çok büyük (${formatFileSize(f.size)})` });
                return null; // Skip bu dosyayı
            }
            
            // EDGE CASE 2: Boş dosya kontrolü
            if (f.size === 0) {
                console.warn(`     ⚠️ "${f.name}" boş dosya, atlanıyor!`);
                skippedFiles.push({ name: f.name, reason: 'Boş dosya (0 byte)' });
                return null;
            }
            
            try {
                // FİX: readAsDataURL direkt base64 döndürür, dönüşüm gereksiz!
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(f);  // Data URL formatı: data:image/jpeg;base64,XXXXX
                });
                
                console.log(`     ✅ "${f.name}" okundu: ${formatFileSize(f.size)}`);
                console.log(`     🔄 Data URL oluşturuldu: ${dataUrl.substring(0, 50)}...`);
                
                return {
                    name: f.name,
                    type: f.type || 'image/jpeg',
                    dataUrl: dataUrl,  // Data URL olarak gönder (base64 içerir)
                    size: f.size
                };
            } catch (error) {
                console.error(`     ❌ "${f.name}" okunamadı:`, error.message);
                skippedFiles.push({ name: f.name, reason: `Okuma hatası: ${error.message}` });
                return null;
            }
        }));
        
        // Null olanları filtrele (atlanan dosyalar)
        const validFiles = fileEntries.filter(f => f !== null);
        
        // Atlanan dosya varsa uyarı göster
        if (skippedFiles.length > 0) {
            console.warn(`  ⚠️ ${skippedFiles.length} dosya atlandı:`);
            skippedFiles.forEach(sf => {
                console.warn(`     - ${sf.name}: ${sf.reason}`);
            });
        }

        if (validFiles.length > 0) {
            payload.push({ folder, files: validFiles });
            totalFiles += validFiles.length;
        }
    }

    console.log(`✅ Toplam ${totalFiles} dosya okundu, ${payload.length} klasör hazırlandı`);

    if (payload.length === 0) {
        selectedImagesPayload = null;
        document.getElementById('folder-status').textContent = '⚠️ Yüklenebilir dosya bulunamadı';
        showResult('❌ Geçerli dosya bulunamadı. Lütfen .jpg dosyaları kontrol edin.', 'error');
        return;
    }

    selectedImagesPayload = { payload, totalFolders: grouped.size, totalFiles };
    document.getElementById('folder-status').textContent = `📁 ${grouped.size} klasör, ${totalFiles} JPG hazır.`;
}

/**
 * Content script'e mesaj gönderir (retry ve timeout desteğiyle)
 * @param {object} message - Gönderilecek mesaj
 * @param {HTMLButtonElement} button - Loading gösterilecek buton
 * @param {number} retryCount - Deneme sayısı
 * @returns {Promise}
 */
async function sendToContentScript(message, button, retryCount = 0) {
    setButtonLoading(button, true);
    
    // İşlem başladığında stop butonunu göster
    toggleStopButton(true);

    try {
        // Aktif sekmeyi bul
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Güvenlik kontrolü: Sadece ikas.com'da çalış
        if (!tab.url.includes('ikas.com')) {
            throw new Error('Lütfen önce Ikas paneline giriş yapın ve varyant sayfasına gidin.');
        }

        // Fallback: İçerik scriptleri yüklü değilse manuel enjekte et
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [
                    'test-simple.js',
                    'modules/reactHelper.js',
                    'modules/domFinder.js',
                    'content.js'
                ]
            });
            console.log('💉 İçerik scriptleri manuel enjekte edildi');
        } catch (injectErr) {
            console.warn('⚠️ Manuel enjeksiyon hata verdi (devam ediyorum):', injectErr.message);
        }

        console.log('📤 Mesaj gönderiliyor:', message);
        
        // EDGE CASE 3: Network timeout kontrolü (Promise.race ile)
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('İşlem zaman aşımına uğradı (30 saniye)')), REQUEST_TIMEOUT_MS);
        });
        
        const messagePromise = chrome.tabs.sendMessage(tab.id, message);
        
        // Timeout veya response - hangisi önce gelirse
        const response = await Promise.race([messagePromise, timeoutPromise]);
        
        console.log('📥 Cevap alındı:', response);

        if (response.success) {
            showResult(response.message, 'success');
            lastFailedRequest = null; // Başarılı olunca retry state'i temizle
            
            // Başarılı işlemde confetti göster
            triggerConfetti();
        } else {
            throw new Error(response.message || 'İşlem başarısız');
        }

    } catch (error) {
        console.error('❌ Hata:', error);
        
        // EDGE CASE 4: Retry mekanizması
        const isRetryableError = 
            error.message.includes('Receiving end does not exist') ||
            error.message.includes('Could not establish connection') ||
            error.message.includes('zaman aşımı') ||
            error.message.includes('timeout');
        
        if (isRetryableError && retryCount < MAX_RETRY_ATTEMPTS) {
            console.warn(`⚠️ Bağlantı hatası, yeniden deneniyor... (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
            showResult(`🔄 Bağlantı hatası, yeniden deneniyor... (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`, 'error');
            
            // 2 saniye bekle ve tekrar dene
            await new Promise(resolve => setTimeout(resolve, 2000));
            return sendToContentScript(message, button, retryCount + 1);
        }
        
        // Retry hakkı bitti veya retry edilemez hata
        lastFailedRequest = { message, button };
        
        // Chrome Extension bağlantı hatası: Content script yüklenmemiş
        if (error.message.includes('Receiving end does not exist') || 
            error.message.includes('Could not establish connection')) {
            showResult(
                '⚠️ Bağlantı hatası! Lütfen Ikas sayfasını yenileyin (F5) ve tekrar deneyin.',
                'error'
            );
        } else if (error.message.includes('zaman aşımı') || error.message.includes('timeout')) {
            showResult(
                '⏱️ İşlem çok uzun sürdü. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
                'error'
            );
        } else {
            showResult(error.message, 'error');
        }
    } finally {
        setButtonLoading(button, false);
        // İşlem bitti, stop butonunu gizle
        toggleStopButton(false);
    }
}

// ===================================================================
// EVENT LISTENERS
// ===================================================================

// Bağlantı Testi
document.getElementById('btn-test').addEventListener('click', async function() {
    await sendToContentScript(
        { action: 'test' },
        this
    );
});

// Fiyat Güncelleme
document.getElementById('btn-update-price').addEventListener('click', async function() {
    const priceInput = document.getElementById('input-price');
    const price = priceInput.value.trim();

    // Validasyon
    if (!price || isNaN(price) || parseFloat(price) < 0) {
        showResult('Lütfen geçerli bir fiyat girin', 'error');
        priceInput.focus();
        return;
    }

    await sendToContentScript(
        { 
            action: 'updatePrice',
            value: parseFloat(price)
        },
        this
    );
});

// Stok Güncelleme
document.getElementById('btn-update-stock').addEventListener('click', async function() {
    const stockInput = document.getElementById('input-stock');
    const stock = stockInput.value.trim();

    // Validasyon
    if (!stock || isNaN(stock) || parseInt(stock) < 0) {
        showResult('Lütfen geçerli bir stok miktarı girin', 'error');
        stockInput.focus();
        return;
    }

    // Uyarı: Stok güncellemesi uzun sürebilir
    const confirmed = confirm(
        `${stock} adet stok değerini tüm varyantlara uygulamak üzeresiniz.\n\n` +
        `Bu işlem popup'ları açıp kapattığı için biraz zaman alabilir.\n\n` +
        `Devam etmek istiyor musunuz?`
    );

    if (!confirmed) {
        return;
    }

    await sendToContentScript(
        { 
            action: 'updateStock',
            value: parseInt(stock)
        },
        this
    );
});

// Enter tuşu ile submit
document.getElementById('input-price').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('btn-update-price').click();
    }
});

document.getElementById('input-stock').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('btn-update-stock').click();
    }
});

// Görsel klasör seçimi
document.getElementById('btn-pick-folder').addEventListener('click', () => {
    document.getElementById('input-folder').click();
});

document.getElementById('input-folder').addEventListener('change', async (e) => {
    await buildImagesPayload(e.target.files);
});

// Görsel yükleme
document.getElementById('btn-upload-images').addEventListener('click', async function() {
    if (!selectedImagesPayload || !selectedImagesPayload.payload) {
        showResult('Lütfen önce klasör seçin (.jpg)', 'error');
        return;
    }

    await sendToContentScript(
        {
            action: 'uploadImages',
            imagesByFolder: selectedImagesPayload.payload
        },
        this
    );
});

// ===================================================================
// INITIALIZATION
// ===================================================================

console.log('✅ Popup.js yüklendi');

// WOW Features: Dark Mode & Sound başlat
initTheme();
initSound();

// Dark Mode Toggle
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Sound Toggle
document.getElementById('sound-toggle').addEventListener('click', toggleSound);

// Stop butonu - İşlemi durdur
document.getElementById('btn-stop').addEventListener('click', async () => {
    if (!confirm('İşlemi durdurmak istediğinizden emin misiniz?')) {
        return;
    }
    
    // Content script'e stop mesajı gönder
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { action: 'stop' });
        showResult('⏹️ İşlem durdurma komutu gönderildi', 'success');
        toggleStopButton(false);
    } catch (err) {
        console.error('Stop mesajı gönderilemedi:', err);
        showResult('❌ Durdurma komutu gönderilemedi', 'error');
    }
});

// Sayfa yüklendiğinde aktif sekmeyi kontrol et
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    const statusDiv = document.getElementById('status');
    
    if (tab.url.includes('ikas.com')) {
        statusDiv.textContent = '✅ Ikas paneli tespit edildi';
        statusDiv.style.color = '#10b981';
    } else {
        statusDiv.textContent = '⚠️ Ikas paneline gidin';
        statusDiv.style.backgroundColor = '#fee2e2';
        statusDiv.style.color = '#991b1b';
    }
});