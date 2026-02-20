/**
 * ===================================================================
 * CONTENT.JS - Main Orchestrator
 * ===================================================================
 * 
 * Bu dosya, Chrome Extension'ın "beyni". Sorumluluğu:
 * 1. Popup'tan gelen mesajları dinlemek
 * 2. Modülleri koordine etmek (domFinder + reactHelper)
 * 3. İşlem sonuçlarını popup'a geri bildirmek
 * 
 * MİMARİ PATTERN: Orchestrator Pattern
 * -------------------------------------
 * Orkestra şefi gibi düşün: Kendi enstrüman çalmaz, ama
 * tüm müzisyenleri koordine eder. Bu dosya da aynı şekilde
 * kendi DOM manipülasyonu yapmaz, modüllere yaptırır.
 * 
 * NEDEN MODÜLER?
 * --------------
 * Content.js'e tüm kodu yığsaydık:
 * - 1000+ satır kod = okunaksız
 * - Test edilmesi zor
 * - Bir hata tüm sistemi durdurur
 * 
 * Modüler yapıda:
 * - Her modül kendi işini yapar
 * - Bağımsız test edilebilir
 * - Bakımı kolay
 * 
 * @author Kıdemli Yazılım Mimarı
 * @mentee Veysel (Fırat Üniversitesi)
 */

if (window.__KAFF_CONTENT_LOADED__) {
    console.log('ℹ️ Content script zaten yüklü, yeniden enjekte edilmiyor.');
} else {
    window.__KAFF_CONTENT_LOADED__ = true;

    (function() {

console.log("--------------------------------------------------");
console.log("🚀 KAFF İKAS OTOMASYONU: Sistem Devrede!");
console.log("📍 Content Script Yüklendi - " + new Date().toLocaleTimeString());
console.log("📍 URL:", window.location.href);
console.log("--------------------------------------------------");

// ===================================================================
// GLOBAL STATE - İŞLEMİ DURDURMA KONTROLÜ
// ===================================================================
let shouldStop = false;

/**
 * İşlemi durdur flag'ini set et
 */
function stopProcess() {
    shouldStop = true;
    console.warn('⏹️ İŞLEM DURDURULDU! Kullanıcı tarafından iptal edildi.');
}

/**
 * İşlem başlamadan önce flag'i sıfırla
 */
function resetStopFlag() {
    shouldStop = false;
}

// ===================================================================
// MODÜL REFERANSLARI (GLOBAL SCOPE)
// ===================================================================
// 
// Manifest'te modüller content script'ten önce yükleniyor:
// 1. modules/reactHelper.js → window.ReactHelper
// 2. modules/domFinder.js → window.DOMFinder
// 3. content.js (bu dosya)

// Modülleri global scope'tan al
const domFinder = window.DOMFinder;
const reactHelper = window.ReactHelper;

// ===================================================================
// KLASÖR - VARYANT EŞLEŞTİRME TABLOSU
// ===================================================================
/**
 * Hardcoded mapping: Klasör ismi -> İkas'taki varyant isimleri
 * 
 * NEDEN HARDCODED?
 * ----------------
 * Token-based fuzzy matching yerine net eşleştirme istendi.
 * Her klasörün hangi telefon modelleriyle eşleşeceği kesin olarak belirlendi.
 * 
 * KULLANIM:
 * ---------
 * 1. Gelen klasör ismini normalize et
 * 2. Bu tablodaki key'leri normalize et
 * 3. Eşleşen key'i bul
 * 4. Value'deki varyant isimlerini al
 * 5. O varyantları İkas'ta bul ve resimleri yükle
 */
const FOLDER_VARIANT_MAPPING = {
    "1-17 Pro Max - Pro": ["iPhone 17 Pro Max", "iPhone 17 Pro"],
    "2-17 Air": ["iPhone 17 Air"],
    "3-16 Pro Max": [
        "iPhone 16 Pro Max", "iPhone 16 Pro", 
        "iPhone 15 Pro Max", "iPhone 15 Pro", 
        "iPhone 14 Pro Max", "iPhone 14 Pro", 
        "iPhone 13 Pro Max", "iPhone 13 Pro", 
        "iPhone 12 Pro Max", "iPhone 12 Pro", 
        "iPhone 11 Pro Max", "iPhone 11 Pro"
    ],
    "4-16": ["iPhone 16", "iPhone 17", "iPhone 16 Plus"],
    "5-13": ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 14 Plus", "iPhone 15 Plus"],
    "6-11": ["iPhone 11", "iPhone 12"],
    "7-S25-S24-S23-S22 Ultra": ["Samsung S25 Ultra", "Samsung S24 Ultra", "Samsung S23 Ultra", "Samsung s22 Ultra"],
    "8-S25 Plus - S25 - S24 Plus-S24- S24 FE - S23 FE - A55 - A54 -A35-A34-A32": [
        "Samsung S25 Plus", "Samsung S25", "Samsung S24 Plus", "Samsung S24", 
        "Samsung S24 FE", "Samsung S23 FE", "Samsung A55", "Samsung A54", 
        "Samsung A35", "Samsung A34", "Samsung A36"
    ],
    "9-s23 Plus-s23": ["Samsung S23 Plus", "Samsung S23"],
    "10-s22 - s22 Plus": ["Samsung S22 Plus", "Samsung S22"],
    "11-A53 - A52 _ A52S 4G _ 5G Case - A33 - A23": [
        "Samsung A53", "Samsung A52/ A52S 4G/ 5G", "Samsung A33", "Samsung A23", "Samsung A32 5G"
    ],
    "12-A51": ["Samsung A51"]
};

// İsim normalize (eşleşme için)
function normalizeName(str = '') {
    const map = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u' };
    return str.toLowerCase()
        .split('')
        .map(ch => map[ch] || ch)
        .join('')
        .replace(/[^a-z0-9]+/g, '');
}

// Token set (hem harf hem sayı blokları)
function tokenize(str = '') {
    const norm = normalizeName(str);
    const tokens = norm.match(/[a-z]+|\d+/g) || [];
    return new Set(tokens);
}

// Kontrol: Modüller yüklendi mi?
if (!domFinder) {
    console.error('❌ FATAL: DOMFinder modülü yüklenemedi!');
} else {
    console.log('✅ DOMFinder hazır:', Object.keys(domFinder).length, 'fonksiyon');
}

if (!reactHelper) {
    console.error('❌ FATAL: ReactHelper modülü yüklenemedi!');
} else {
    console.log('✅ ReactHelper hazır:', Object.keys(reactHelper).length, 'fonksiyon');
}

// ===================================================================
// SAYFA HAZIRLIK KONTROLÜ
// ===================================================================

// SPA detection
setTimeout(() => {
    const appRoot = document.getElementById('root') || document.getElementById('app');
    if (appRoot) {
        console.log("✅ SPA (Single Page Application) yapısı tespit edildi.");
        console.log("🎯 React/Vue event system aktif olmalı.");
    } else {
        console.log("⚠️ Uyarı: Root elementi bulunamadı. Geleneksel HTML olabilir.");
    }
}, 2000);

// ===================================================================
// İŞLEM FONKSİYONLARI
// ===================================================================

/**
 * Test fonksiyonu: Bağlantıyı kontrol eder
 */
async function handleTest() {
    reactHelper.logHeader('Bağlantı Testi');
    
    // Sayfa kontrolü
    const isVariant = domFinder.isVariantPage();
    
    if (!isVariant) {
        return {
            success: false,
            message: '⚠️ Varyant sayfasında değilsiniz! Lütfen ürün varyantı ekleme sayfasına gidin.'
        };
    }
    
    const count = domFinder.getVariantCount();
    
    return {
        success: true,
        message: `✅ Bağlantı başarılı! ${count} varyant bulundu. Sistem hazır.`
    };
}

/**
 * Tüm fiyatları günceller
 * @param {number} price - Yeni fiyat
 */
async function handleUpdatePrice(price) {
    reactHelper.logHeader(`Fiyat Güncelleme: ${price} TL`);
    
    // Önce sayfa kontrolü
    if (!domFinder.isVariantPage()) {
        return {
            success: false,
            message: '❌ Varyant sayfasında değilsiniz!'
        };
    }
    
    try {
        // Tüm fiyat inputlarını bul
        const inputs = domFinder.findAllPriceInputs();
        
        if (inputs.length === 0) {
            return {
                success: false,
                message: '❌ Fiyat inputu bulunamadı. Sayfa yapısı değişmiş olabilir.'
            };
        }
        
        console.log(`📝 ${inputs.length} fiyat inputu bulundu, güncelleniyor...`);
        
        // Toplu güncelleme
        const result = await reactHelper.bulkUpdateInputs(inputs, price, 100);
        
        // Başarı kontrolü
        if (result.success === result.total) {
            return {
                success: true,
                message: `✅ ${result.success} fiyat başarıyla güncellendi!`,
                variantCount: result.success
            };
        } else if (result.success > 0) {
            return {
                success: true,
                message: `⚠️ ${result.success}/${result.total} fiyat güncellendi. ${result.failed} hata.`,
                variantCount: result.success
            };
        } else {
            return {
                success: false,
                message: `❌ Hiçbir fiyat güncellenemedi!`
            };
        }
        
    } catch (error) {
        console.error('❌ Fiyat güncelleme hatası:', error);
        return {
            success: false,
            message: `❌ Hata: ${error.message}`
        };
    }
}

/**
 * Tüm stokları günceller
 * @param {number} stock - Yeni stok miktarı
 * 
 * NOT: Bu işlem uzun sürebilir çünkü her varyant için
 * popup açıp kapatması gerekiyor.
 */
async function handleUpdateStock(stock) {
    reactHelper.logHeader(`Stok Güncelleme: ${stock} adet`);
    
    // Sayfa kontrolü
    if (!domFinder.isVariantPage()) {
        return {
            success: false,
            message: '❌ Varyant sayfasında değilsiniz!'
        };
    }
    
    try {
        // Varyant satırlarını bul
        const rows = domFinder.findVariantRows();
        
        if (rows.length === 0) {
            return {
                success: false,
                message: '❌ Varyant bulunamadı!'
            };
        }
        
        console.log(`📦 ${rows.length} varyant için stok güncellenecek...`);
        console.log('⏳ Bu işlem biraz uzun sürebilir, lütfen bekleyin...');
        
        let successCount = 0;
        let failCount = 0;
        
        // Her varyant için sırayla işle
        for (let i = 0; i < rows.length; i++) {
            // STOP KONTROLÜ - Kullanıcı durdur dedi mi?
            if (shouldStop) {
                console.warn('⏹️ İşlem kullanıcı tarafından durduruldu!');
                return {
                    success: false,
                    message: `⏹️ İşlem durduruldu! (${successCount}/${rows.length} tamamlandı)`
                };
            }
            
            const row = rows[i];
            const variantName = domFinder.getVariantName(row);
            
            console.log(`\n[${i + 1}/${rows.length}] İşleniyor: ${variantName}`);
            
            try {
                // TIMEOUT WRAPPER: Her varyant için maksimum 5 saniye
                const variantUpdatePromise = (async () => {
                    // 1. Stok popup'ını aç
                    const stockInput = await domFinder.openStockPopup(row);
                    
                    if (!stockInput) {
                        throw new Error('Stok inputu bulunamadı');
                    }
                    
                    // 2. Değeri güncelle - hızlı!
                    await new Promise(resolve => setTimeout(resolve, 150));
                    reactHelper.setInputValue(stockInput, stock);

                    // 3. Kaydet butonuna bas - anlık!
                    await new Promise(resolve => setTimeout(resolve, 50));
                    const saveButton = domFinder.findStockSaveButton();
                    
                    if (saveButton) {
                        saveButton.click();
                        console.log('✅ Kaydedildi');
                    } else {
                        throw new Error('Kaydet butonu bulunamadı');
                    }
                    
                    // 4. Popup kapanınca HEMEN devam - sadece kapanma tespiti
                    const startTime = Date.now();
                    while (Date.now() - startTime < 800) {
                        const isOpen = document.querySelector('[role="dialog"]') || 
                                      document.querySelector('.modal') ||
                                      document.querySelector('[class*="drawer"]');
                        
                        if (!isOpen) {
                            console.log('✅ Popup kapandı - hemen devam!');
                            break; // ANINDA ÇIK!
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 20)); // Her 20ms kontrol
                    }
                    
                    // HIÇ BEKLEME - direkt devam!
                })();
                
                // 5 saniyelik timeout
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('İşlem zaman aşımına uğradı (5 saniye)')), 5000);
                });
                
                // Hangisi önce biterse
                await Promise.race([variantUpdatePromise, timeoutPromise]);
                
                successCount++;
                
            } catch (error) {
                console.error(`❌ ${variantName} hatası:`, error.message);
                failCount++;
                
                // Popup açıksa MUTLAKA kapat
                try {
                    domFinder.closeStockPopup();
                    console.log('🔧 Popup zorla kapatıldı');
                } catch (closeErr) {
                    console.warn('⚠️ Popup kapatılırken hata:', closeErr.message);
                }
                
                // Temizleme süresi - minimal!
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // Sonuç raporla
        if (successCount === rows.length) {
            return {
                success: true,
                message: `✅ ${successCount} varyantın stoğu güncellendi!`,
                variantCount: successCount
            };
        } else if (successCount > 0) {
            return {
                success: true,
                message: `⚠️ ${successCount}/${rows.length} stok güncellendi. ${failCount} hata.`,
                variantCount: successCount
            };
        } else {
            return {
                success: false,
                message: `❌ Hiçbir stok güncellenemedi!`
            };
        }
        
    } catch (error) {
        console.error('❌ Stok güncelleme hatası:', error);
        return {
            success: false,
            message: `❌ Hata: ${error.message}`
        };
    }
}

// ===================================================================
// MESAJ DİNLEYİCİ (MESSAGE LISTENER)
// ===================================================================
/**
 * Popup'tan gelen mesajları dinler
 * 
 * MESAJİLAŞMA PROTOKOLü:
 * ----------------------
 * Popup şu mesajları gönderebilir:
 * - { action: 'test' }
 * - { action: 'updatePrice', value: 1299 }
 * - { action: 'updateStock', value: 10000 }
 * 
 * Her mesaj için bir response döndürmek zorunlu:
 * - { success: true, message: "Başarılı!" }
 * - { success: false, message: "Hata mesajı" }
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('\n📬 Mesaj alındı:', message);
    
    // Async işlem için wrapping
    (async () => {
        try {
            // Modül kontrolü
            if (!domFinder || !reactHelper) {
                sendResponse({
                    success: false,
                    message: '❌ Modüller yüklenemedi. Lütfen sayfayı yenileyin (F5).'
                });
                return;
            }
            
            let result;
            
            // Action'a göre işlem yap
            switch (message.action) {
                case 'test':
                    result = await handleTest();
                    break;
                    
                case 'stop':
                    // İşlemi durdur
                    stopProcess();
                    result = {
                        success: true,
                        message: '⏹️ İşlem durduruldu'
                    };
                    break;
                    
                case 'updatePrice':
                    resetStopFlag(); // İşlem başında flag'i sıfırla
                    if (!message.value) {
                        result = { success: false, message: '❌ Fiyat değeri eksik!' };
                    } else {
                        result = await handleUpdatePrice(message.value);
                    }
                    break;
                    
                case 'updateStock':
                    resetStopFlag(); // İşlem başında flag'i sıfırla
                    if (!message.value) {
                        result = { success: false, message: '❌ Stok değeri eksik!' };
                    } else {
                        result = await handleUpdateStock(message.value);
                    }
                    break;

                case 'uploadImages':
                    resetStopFlag(); // İşlem başında flag'i sıfırla
                    if (!message.imagesByFolder || !Array.isArray(message.imagesByFolder)) {
                        result = { success: false, message: '❌ Görsel verisi gelmedi.' };
                    } else {
                        result = await handleUploadImages(message.imagesByFolder);
                    }
                    break;
                    
                default:
                    result = { 
                        success: false, 
                        message: `❌ Bilinmeyen action: ${message.action}` 
                    };
            }
            
            console.log('📤 Cevap gönderiliyor:', result);
            sendResponse(result);
            
        } catch (error) {
            console.error('❌ İşlem hatası:', error);
            sendResponse({
                success: false,
                message: `❌ Beklenmeyen hata: ${error.message}`
            });
        }
    })();
    
    // IMPORTANT: Chrome'un async mesajlaşması için true dönmek zorunlu
    return true;
});

// ===================================================================
// KEYBOARD SHORTCUTS (Opsiyonel)
// ===================================================================
/**
 * Hızlı klavye kısayolları
 * Ctrl+Shift+K: Debug console'u aç
 */
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        console.log('\n🎯 ===== KAFF DEBUG PANEL =====');
        console.log('Varyant sayısı:', domFinder?.getVariantCount() || 'Modül yüklenmedi');
        console.log('Sayfa:', domFinder?.isVariantPage() ? 'Varyant sayfası ✅' : 'Başka sayfa ⚠️');
        console.log('================================\n');
    }
});

console.log("✅ Content script hazır. Popup'tan mesaj bekleniyor...");
console.log("💡 İpucu: Ctrl+Shift+K ile debug panel'i açabilirsiniz.");


/**
 * Görsel yükleme (varyant klasörleri -> görseller)
 * @param {Array} imagesByFolder - [{ folder, files: [{name,type,buffer}] }]
 * 
 * YENİ YÖNTEMDEKİ MANTIK:
 * -----------------------
 * Token-based fuzzy matching yerine hardcoded FOLDER_VARIANT_MAPPING kullanılıyor.
 * 
 * ADIMLAR:
 * 1. Mapping tablosunu normalize et (performans için bir kez cache)
 * 2. Gelen folder isimlerini mapping'e göre varyantlarla eşleştir
 * 3. Her varyant için İkas satırlarında eşleşme ara
 * 4. Eşleşen varyantlar için klasördeki TÜM resimleri yükle
 */
async function handleUploadImages(imagesByFolder = []) {
    reactHelper.logHeader('Görsel Yükleme (Hardcoded Mapping)');

    if (!domFinder.isVariantPage()) {
        return { success: false, message: '❌ Varyant sayfasında değilsiniz!' };
    }

    const rows = domFinder.findVariantRows();
    if (rows.length === 0) {
        return { success: false, message: '❌ Varyant bulunamadı!' };
    }

    console.log(`📁 ${imagesByFolder.length} klasör alındı`);
    console.log(`📋 ${rows.length} varyant bulundu`);

    // ===================================================================
    // ADIM 1: Mapping tablosunu normalize et (bir kez)
    // ===================================================================
    const normalizedMapping = {};
    Object.entries(FOLDER_VARIANT_MAPPING).forEach(([folderKey, variantNames]) => {
        const normKey = normalizeName(folderKey);
        normalizedMapping[normKey] = variantNames.map(v => ({
            original: v,
            normalized: normalizeName(v)
        }));
    });

    console.log('📌 Mapping tablosu normalize edildi:', Object.keys(normalizedMapping).length, 'klasör');

    // ===================================================================
    // ADIM 2: Gelen folder'ları mapping'e göre eşleştir
    // ===================================================================
    // normalized variant name -> files array
    const variantToFilesMap = new Map();

    imagesByFolder.forEach(entry => {
        const normFolder = normalizeName(entry.folder);
        
        console.log(`\n📂 Klasör: "${entry.folder}" (normalized: "${normFolder}")`);
        console.log(`   Dosya sayısı: ${entry.files?.length || 0}`);
        
        // Bu folder mapping'de var mı?
        if (normalizedMapping[normFolder]) {
            const mappedVariants = normalizedMapping[normFolder];
            console.log(`   ✅ Mapping bulundu! ${mappedVariants.length} varyantla eşleşecek:`);
            
            mappedVariants.forEach(v => {
                console.log(`      → "${v.original}" (normalized: "${v.normalized}")`);
                variantToFilesMap.set(v.normalized, entry.files);
            });
        } else {
            console.warn(`   ⚠️ Mapping'de bulunamadı: "${entry.folder}"`);
            console.warn(`   💡 Kontrol edin: Bu klasör adı FOLDER_VARIANT_MAPPING'de var mı?`);
        }
    });

    console.log(`\n🔗 Toplam ${variantToFilesMap.size} varyant eşleştirildi`);

    // ===================================================================
    // ADIM 3: İkas varyantlarını tara ve eşleşenleri yükle
    // ===================================================================
    let successCount = 0;
    const missing = [];
    const uploaded = [];

    for (let i = 0; i < rows.length; i++) {
        // STOP KONTROLÜ - Kullanıcı durdur dedi mi?
        if (shouldStop) {
            console.warn('⏹️ İşlem kullanıcı tarafından durduruldu!');
            return {
                success: false,
                message: `⏹️ İşlem durduruldu! (${successCount}/${rows.length} görsel yüklendi)`
            };
        }
        
        const row = rows[i];
        const variantName = domFinder.getVariantName(row) || `Varyant-${i+1}`;
        const normVariant = normalizeName(variantName);

        console.log(`\n[${i + 1}/${rows.length}] İşleniyor: "${variantName}"`);
        console.log(`   Normalized: "${normVariant}"`);
        
        // Bu varyant için dosya var mı?
        const files = variantToFilesMap.get(normVariant);

        if (!files || files.length === 0) {
            console.warn(`   ⚠️ Eşleşen klasör bulunamadı`);
            missing.push(variantName);
            continue;
        }

        console.log(`   ✅ ${files.length} dosya bulundu, yükleniyor...`);

        try {
            // TIMEOUT WRAPPER: Her varyant için maksimum 10 saniye
            const imageUploadPromise = (async () => {
                // ===================================================================
                // ADIM 4: Görsel popup'ını aç ve dosyaları yükle
                // ===================================================================
                const imageCtx = await domFinder.openImagePopup(row);
                if (!imageCtx?.input) {
                    throw new Error('Görsel inputu bulunamadı');
                }

                const { drawer, input } = imageCtx;

                // Popup açılsın - hızlı!
                await new Promise(res => setTimeout(res, 200));

                // FileList oluştur
                const dt = new DataTransfer();
                files.forEach(f => {
                    try {
                        // FİX: Data URL'den base64'ü çıkart
                        // Format: data:image/jpeg;base64,XXXXX
                        const base64Data = f.dataUrl.split(',')[1]; // "data:..." kısmını at
                        const binaryString = atob(base64Data);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        
                        const fileObj = new File([bytes], f.name, { type: f.type || 'image/jpeg' });
                        dt.items.add(fileObj);
                        
                        // Debug: Dosya boyutunu göster
                        const sizeKB = (fileObj.size / 1024).toFixed(1);
                        console.log(`      → Eklendi: ${f.name} (${sizeKB} KB) - Original: ${f.size} byte, File: ${fileObj.size} byte`);
                    } catch (err) {
                        console.warn(`      ⚠️ Dosya oluşturulamadı: ${f.name}`, err.message);
                    }
                });

                // Input'a dosyaları set et
                input.files = dt.files;
                console.log(`   📎 ${dt.files.length} dosya input'a set edildi`);

                // Event'leri tetikle (React için)
                ['input', 'change'].forEach(evt => {
                    input.dispatchEvent(new Event(evt, { bubbles: true }));
                });

                // Önizleme yüklensin (maksimum 5 saniye bekle)
                console.log(`   ⏳ Önizleme bekleniyor...`);
                const previewImg = await domFinder.waitForImagePreview(drawer, 5000);
                
                if (!previewImg) {
                    console.warn(`   ⚠️ Önizleme görünmedi! Ama devam ediyoruz...`);
                } else {
                    console.log(`   ✅ Önizleme yüklendi:`, previewImg.src?.substring(0, 50) + '...');
                }

                // Upload işleminin tamamlanması için bekle
                console.log(`   ⏳ Upload tamamlanıyor (1 saniye bekleniyor)...`);
                await new Promise(res => setTimeout(res, 1000));

                // Kaydet butonunu bul ve tıkla
                console.log(`   🔍 Kaydet butonu aranıyor...`);
                const saveButton = domFinder.findSaveButton('kaydet');
                
                if (saveButton) {
                    console.log(`   ✅ Kaydet butonu bulundu, tıklanıyor...`);
                    saveButton.click();
                    
                    // Kaydedilmesini bekle
                    await new Promise(res => setTimeout(res, 800));
                    console.log(`   ✅ Kaydedildi!`);
                } else {
                    console.warn(`   ⚠️ Kaydet butonu bulunamadı`);
                }
                
                // Drawer kapanınca HEMEN devam
                const startTime = Date.now();
                while (Date.now() - startTime < 1000) {
                    const isOpen = document.querySelector('[role="dialog"]') || 
                                  document.querySelector('.modal') ||
                                  document.querySelector('[class*="drawer"]');
                    
                    if (!isOpen) {
                        console.log('   ✅ Drawer kapandı - hemen devam!');
                        break; // ANINDA ÇIK!
                    }
                    
                    await new Promise(res => setTimeout(res, 20)); // Her 20ms kontrol
                }
                
                // HIÇ BEKLEME!
            })();
            
            // 10 saniyelik timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Görsel yükleme zaman aşımına uğradı (10 saniye)')), 10000);
            });
            
            // Hangisi önce biterse
            await Promise.race([imageUploadPromise, timeoutPromise]);

            successCount++;
            uploaded.push(variantName);
            console.log(`   ✅ İşlem tamamlandı!`);

        } catch (error) {
            console.error(`   ❌ Hata:`, error.message);
            
            // Hata durumunda drawer'ı KAPAT
            try {
                domFinder.closeStockPopup();
                console.log('   🔧 Drawer zorla kapatıldı');
            } catch (closeErr) {
                console.warn('   ⚠️ Drawer kapatılırken hata:', closeErr.message);
            }
            
            // Temizleme süresi - minimal!
            await new Promise(res => setTimeout(res, 150));
        }
    }

    // ===================================================================
    // SONUÇ RAPORLAMA
    // ===================================================================
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 ÖZET RAPOR');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Başarılı: ${successCount} varyant`);
    console.log(`⚠️ Eşleşmeyen: ${missing.length} varyant`);
    console.log(`📋 Toplam: ${rows.length} varyant`);
    
    if (uploaded.length > 0) {
        console.log('\n✅ Yüklenen varyantlar:');
        uploaded.forEach(v => console.log(`   - ${v}`));
    }
    
    if (missing.length > 0) {
        console.log('\n⚠️ Klasör bulunamayan varyantlar:');
        missing.forEach(v => console.log(`   - ${v}`));
    }
    console.log('═══════════════════════════════════════════════════\n');

    const missingMsg = missing.length > 0 
        ? ` | ⚠️ Klasör bulunamadı: ${missing.length} varyant` 
        : '';

    if (successCount > 0) {
        return {
            success: true,
            message: `✅ ${successCount}/${rows.length} varyant için görseller yüklendi${missingMsg}`,
            variantCount: successCount
        };
    }

    return {
        success: false,
        message: `❌ Hiçbir görsel yüklenemedi. ${missing.length} varyant için klasör bulunamadı.`
    };
}

    })();
}