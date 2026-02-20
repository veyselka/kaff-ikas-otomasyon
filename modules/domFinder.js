/**
 * ===================================================================
 * DOM FINDER MODULE
 * ===================================================================
 * 
 * Bu modül, Ikas sayfasındaki spesifik elementleri (varyant satırları,
 * fiyat inputları, stok butonları vs) bulma sorumluluğunu taşır.
 * 
 * TASARIM PRENSİBİ: Single Responsibility
 * ----------------------------------------
 * JavaScript'te "Separation of Concerns" (Sorumlulukların Ayrılması)
 * çok önemli. Bu modül SADECE "element bulma" işiyle ilgilenir.
 * Element'i ne yapacağımız başka modülün sorumluluğu (reactHelper).
 * 
 * NEDEN BU YAKLAŞIM?
 * ------------------
 * Yarın Ikas HTML yapısını değiştirirse, sadece bu dosyayı düzenleriz.
 * Diğer modüller etkilenmez. Bu "Loose Coupling" (Gevşek Bağlantı) prensibi.
 * 
 * @author Kıdemli Yazılım Mimarı
 * @mentee Veysel Kılıçerkan(Fırat Üniversitesi)
 */

// Tekrar yüklenmeyi önlemek için guard
if (window.__KAFF_DOMFINDER_LOADED__) {
    console.log('ℹ️ DOMFinder zaten yüklü, yeniden enjekte edilmiyor.');
} else {
    window.__KAFF_DOMFINDER_LOADED__ = true;

    (function() {
        // ReactHelper window.ReactHelper üzerinden erişilir (global scope)
        const { logHeader } = window.ReactHelper;

/**
 * SELECTOR KONFİGÜRASYONU
 * =======================
 * 
 * Tüm selector'ları bir objede topladık. Neden?
 * 1. Tek yerden yönetim (bakım kolaylığı)
 * 2. Değişiklik yapınca sadece burayı düzenle
 * 3. Fallback stratejisi (birinci bulamazsa ikinciye geç)
 * 
 * ÖNCELIK SİSTEMİ:
 * ----------------
 * Her element için selector array'i var. İlk eleman en güvenilir,
 * sonraki elemanlar fallback. Örnek:
 * 
 * priceInput: [
 *   'input.ikas-price-input',           // Priority 1: Semantic class
 *   'input[data-type*="price"]',        // Priority 2: Attribute
 *   'input[class*="price-input"]'       // Priority 3: Partial match
 * ]
 */
const SELECTORS = {
    // Varyant satırları (tablo row'ları)
    // Varyant satırları (önce data-row-key, diğerleri yedek)
    variantRows: [
        'tr[data-row-key]',
        '[class*="data-table-row"]',
        '.ant-table-row'
    ],

    // Varyant ismi (her satırdaki)
    variantName: [
        '.ant-typography-single-line',
        '.ant-typography-ellipsis',
        '[class*="typography"]'
    ],

    // Fiyat inputları
    priceInput: [
        'input.ikas-price-input',
        'input[class*="price-input"]',
        '.ikas-price-input-wrapper input'
    ],

    // Stok butonu (popup açan)
    stockButton: [
        'button[class*="StockColumnButton"]',
        'button:has(span:contains("adet"))',
        '[class*="stock"] button'
    ],

    // Stok input (popup içinde)
    stockInput: [
        '.ikas-masked-input-wrapper input',
        'input[dir="ltr"]',
        '.ant-drawer input[type="text"]'
    ],

    // Görsel butonu
    imageButton: [
        'button[class*="EmptyThumbnail"]',
        'button.ant-btn-icon-only:has(svg)',
        '[class*="image"] button'
    ],

    // Görsel upload alanı (popup içinde)
    imageUpload: [
        'input[type="file"]',
        'input[type="file"][accept*="image"]',
        '.ant-upload-drag-container input[type="file"]',
        '.ant-upload-btn input[type="file"]'
    ],

    // Popup/Drawer container'ları
    drawer: [
        '.ant-drawer-content[aria-modal="true"]',
        '.ant-drawer-content',
        '[role="dialog"]'
    ]
};

/**
 * Esnek selector fonksiyonu: Birden fazla selector dener
 * 
 * ALGORITMA:
 * ----------
 * 1. Selector array'ini sırayla dene
 * 2. İlk eşleşeni döndür
 * 3. Hiçbiri bulamazsa null döndür
 * 
 * @param {string[]} selectors - Selector array (öncelik sırasına göre)
 * @param {Element} context - Arama yapılacak context (default: document)
 * @returns {Element|null} - Bulunan element
 */
function findWithFallback(selectors, context = document) {
    for (const selector of selectors) {
        try {
            const element = context.querySelector(selector);
            if (element) {
                console.log(`✅ Element bulundu: ${selector}`);
                return element;
            }
        } catch (error) {
            console.warn(`⚠️ Geçersiz selector: ${selector}`, error.message);
        }
    }
    
    console.error(`❌ Hiçbir selector bulamadı:`, selectors);
    return null;
}

/**
 * Birden fazla element bulmak için (querySelectorAll benzeri)
 * 
 * @param {string[]} selectors - Selector array
 * @param {Element} context - Arama context'i
 * @returns {Element[]} - Bulunan elementler
 */
function findAllWithFallback(selectors, context = document) {
    for (const selector of selectors) {
        try {
            const elements = context.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`✅ ${elements.length} element bulundu: ${selector}`);
                return Array.from(elements);
            }
        } catch (error) {
            console.warn(`⚠️ Geçersiz selector: ${selector}`, error.message);
        }
    }
    
    console.warn(`⚠️ Hiçbir element bulunamadı:`, selectors);
    return [];
}

/**
 * Drawer/modal içindeki "Kaydet" butonunu bulur
 * @param {string} label - Aranacak metin (default: 'kaydet')
 * @returns {HTMLButtonElement|null}
 */
function findSaveButton(label = 'kaydet') {
    const targetText = label.toLowerCase();

    // Öncelik: Drawer footer içindeki butonlar
    const footers = document.querySelectorAll('.ant-drawer-footer, [class*="drawer-footer"], [class*="drawer-footer"]');
    const candidates = [];

    footers.forEach(footer => {
        footer.querySelectorAll('button').forEach(btn => candidates.push(btn));
    });

    // Eğer footer yoksa genel buton havuzuna bak (modal açıkken)
    if (candidates.length === 0) {
        document.querySelectorAll('.ant-drawer button, [role="dialog"] button').forEach(btn => candidates.push(btn));
    }

    const saveBtn = candidates.find(btn => btn.textContent.trim().toLowerCase().includes(targetText));

    if (saveBtn) {
        console.log('✅ Kaydet butonu bulundu');
        return saveBtn;
    }

    console.warn('⚠️ Kaydet butonu bulunamadı');
    return null;
}

// Geriye dönük uyum: Stok/görsel için aynı aramayı kullanıyoruz
const findStockSaveButton = () => findSaveButton('kaydet');

/**
 * Görsel butonunu bulur
 * @param {Element} row
 * @returns {HTMLButtonElement|null}
 */
function findImageButton(row) {
    if (!row) {
        console.error('❌ findImageButton: Row elementi null!');
        return null;
    }

    const button = findWithFallback(SELECTORS.imageButton, row);
    if (button) {
        console.log('🖼️ Görsel butonu bulundu');
    }
    return button;
}

/**
 * Görsel upload popup'ını açar ve file input'u döndürür
 * @param {Element} row
 * @returns {Promise<HTMLInputElement|null>}
 */
async function openImagePopup(row) {
    console.log('🖼️ Görsel popup açılıyor...');

    const button = findImageButton(row);
    if (!button) return null;

    button.click();

    try {
        const { waitForElement } = window.ReactHelper;

        // Drawer/dialog hazır olsun
        const drawer = await waitForElement(SELECTORS.drawer[0], 5000);

        // File input'u drawer içinde ara
        const input = drawer.querySelector('input[type="file"]') ||
                      findWithFallback(SELECTORS.imageUpload, drawer) ||
                      await waitForElement(SELECTORS.imageUpload[0], 5000);
        console.log('✅ Görsel inputu hazır');
        return { drawer, input };
    } catch (error) {
        console.error('❌ Görsel popup açılamadı:', error.message);
        return null;
    }
}

/**
 * Yüklenmiş görsel önizlemesini bekler
 * @param {Element} drawer
 * @param {number} timeout
 * @returns {Promise<Element|null>}
 */
function waitForImagePreview(drawer, timeout = 5000) {
    const start = Date.now();
    const selectors = [
        'img',
        '.ant-upload-list-item-thumbnail img',
        '.ant-image-img',
        'img[src^="blob:"]',
        'img[src^="data:"]'
    ];

    return new Promise(resolve => {
        const check = () => {
            const found = findWithFallback(selectors, drawer || document);
            if (found) return resolve(found);
            if (Date.now() - start > timeout) return resolve(null);
            requestAnimationFrame(check);
        };
        check();
    });
}

/**
 * Tüm varyant satırlarını bulur
 * 
 * KULLANIM SENARYOSU:
 * -------------------
 * Kullanıcı "Tüm fiyatları güncelle" dediğinde, önce varyant
 * satırlarını buluyoruz. Her satır = bir varyant.
 * 
 * @returns {Element[]} - Varyant satırları
 * 
 * @example
 * const rows = findVariantRows();
 * console.log(`${rows.length} varyant bulundu`);
 */
function findVariantRows() {
    logHeader('Varyant Satırları Aranıyor');

    const rawRows = findAllWithFallback(SELECTORS.variantRows);

    // Önce data-row-key varsa onu kullan, yoksa thead/ghost dışı satırları al
    let rows = [];

    const keyed = rawRows.filter(r => r.getAttribute('data-row-key'));
    if (keyed.length > 0) {
        const seen = new Set();
        rows = keyed.filter(row => {
            const key = row.getAttribute('data-row-key');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    } else {
        // data-row-key yoksa, header (thead) satırlarını çıkar, kalanları al
        rows = rawRows.filter(row => !row.closest('thead'));
    }

    if (rows.length === 0) {
        console.error('❌ HATA: Varyant sayfasında değil misiniz?');
        console.log('💡 İpucu: Ürün → Varyantlı Ürün Ekle sayfasına gidin');
    } else {
        console.log(`✅ ${rows.length} varyant satırı bulundu`);
    }

    return rows;
}

/**
 * Bir varyant satırındaki varyant ismini çıkarır
 * 
 * ÖĞRETİCİ NOT:
 * -------------
 * Buradaki pattern, Java'daki getter metoduna benzer:
 * 
 * Java:
 *   Product product = getProduct();
 *   String name = product.getName();
 * 
 * JavaScript (bizim yaklaşım):
 *   const row = findVariantRows()[0];
 *   const name = getVariantName(row);
 * 
 * @param {Element} row - Varyant satırı elementi
 * @returns {string|null} - Varyant ismi
 * 
 * @example
 * const rows = findVariantRows();
 * rows.forEach(row => {
 *     const name = getVariantName(row);
 *     console.log(`Varyant: ${name}`);
 * });
 */
function getVariantName(row) {
    if (!row) {
        console.error('❌ getVariantName: Row elementi null!');
        return null;
    }

    const nameElement = findWithFallback(SELECTORS.variantName, row);
    
    if (nameElement) {
        const name = nameElement.textContent.trim();
        console.log(`📝 Varyant ismi: "${name}"`);
        return name;
    }
    
    return null;
}

/**
 * Bir varyant satırındaki fiyat inputunu bulur
 * 
 * @param {Element} row - Varyant satırı
 * @returns {HTMLInputElement|null} - Fiyat input elementi
 */
function findPriceInput(row) {
    if (!row) {
        console.error('❌ findPriceInput: Row elementi null!');
        return null;
    }

    const input = findWithFallback(SELECTORS.priceInput, row);
    
    if (input) {
        console.log(`💰 Fiyat inputu bulundu. Mevcut değer: "${input.value}"`);
    }
    
    return input;
}

/**
 * Tüm varyantların fiyat inputlarını bulur
 * 
 * @returns {HTMLInputElement[]} - Tüm fiyat inputları
 * 
 * @example
 * const allPrices = findAllPriceInputs();
 * console.log(`${allPrices.length} fiyat input'u bulundu`);
 */
function findAllPriceInputs() {
    logHeader('Tüm Fiyat Inputları Aranıyor');
    
    const rows = findVariantRows();
    const inputs = [];

    rows.forEach((row, index) => {
        const input = findPriceInput(row);
        if (input) {
            inputs.push(input);
        } else {
            console.warn(`⚠️ Satır ${index + 1}: Fiyat inputu bulunamadı`);
        }
    });

    console.log(`✅ Toplam ${inputs.length} / ${rows.length} fiyat inputu bulundu`);
    return inputs;
}

/**
 * Bir varyant satırındaki stok butonunu bulur
 * 
 * NOT: Stok, bir popup/drawer içinde. Bu fonksiyon sadece
 * popup'ı açan butonu bulur. Popup'taki input için
 * openStockPopup() fonksiyonunu kullan.
 * 
 * @param {Element} row - Varyant satırı
 * @returns {HTMLButtonElement|null} - Stok butonu
 */
function findStockButton(row) {
    if (!row) {
        console.error('❌ findStockButton: Row elementi null!');
        return null;
    }

    const button = findWithFallback(SELECTORS.stockButton, row);
    
    if (button) {
        console.log(`📦 Stok butonu bulundu: "${button.textContent.trim()}"`);
    }
    
    return button;
}

/**
 * Stok popup'ını açar ve input elementini döndürür
 * 
 * ASYNC OPERATION:
 * ----------------
 * Bu fonksiyon async çünkü:
 * 1. Butona tıklar (popup açılmaya başlar)
 * 2. Popup yüklenene kadar bekler (waitForElement)
 * 3. Input'u bulup döndürür
 * 
 * KULLANIM:
 * ---------
 * const rows = findVariantRows();
 * const stockInput = await openStockPopup(rows[0]);
 * setInputValue(stockInput, '10000');
 * 
 * @param {Element} row - Varyant satırı
 * @returns {Promise<HTMLInputElement|null>} - Stok input elementi
 */
async function openStockPopup(row) {
    console.log('🔓 Stok popup\'ı açılıyor...');
    
    const button = findStockButton(row);
    if (!button) {
        return null;
    }

    // Butona tıkla
    button.click();
    
    // Popup yüklenene kadar bekle
    try {
        const { waitForElement } = window.ReactHelper;
        
        // Önce drawer'ın yüklendiğini onayla
        await waitForElement(SELECTORS.drawer[0], 5000);
        
        // Sonra input'u bul
        const input = await waitForElement(SELECTORS.stockInput[0], 3000);
        
        console.log(`✅ Stok inputu hazır. Mevcut değer: "${input.value}"`);
        return input;
        
    } catch (error) {
        console.error('❌ Stok popup\'ı açılamadı:', error.message);
        return null;
    }
}

/**
 * Stok popup'ını kapatır
 * 
 * KRİTİK: Popup'ı kapatmadan sonraki varyanta geçme!
 * Açık popup, bir sonraki işlemi bozar.
 * 
 * @returns {boolean} - Kapatma başarılı mı?
 */
function closeStockPopup() {
    console.log('🔒 Stok popup\'ı kapatılıyor...');
    
    // Ant Design drawer kapatma butonları
    const closeSelectors = [
        '.ant-drawer-close',
        'button[aria-label="Close"]',
        '.ant-drawer-header button',
        'button:has(svg path[d*="M563.8"])'  // X icon SVG path
    ];

    const closeButton = findWithFallback(closeSelectors);
    
    if (closeButton) {
        closeButton.click();
        console.log('✅ Popup kapatıldı');
        return true;
    }
    
    console.warn('⚠️ Kapatma butonu bulunamadı, ESC tuşuna basılıyor...');
    
    // Fallback: ESC tuşuna bas
    const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        bubbles: true
    });
    document.dispatchEvent(escEvent);
    
    return true;
}

/**
 * Varyant sayısını döndürür
 * 
 * @returns {number} - Varyant sayısı
 */
function getVariantCount() {
    const rows = findVariantRows();
    return rows.length;
}

/**
 * Sayfanın varyant sayfası olup olmadığını kontrol eder
 * 
 * KULLANİM:
 * ---------
 * Extension her Ikas sayfasında çalışır. Ama bizim fonksiyonlarımız
 * sadece varyant sayfasında çalışmalı. Bu fonksiyon, doğru sayfada
 * olup olmadığımızı kontrol eder.
 * 
 * @returns {boolean} - Varyant sayfasında mı?
 */
function isVariantPage() {
    const rows = findVariantRows();
    const hasVariants = rows.length > 0;
    
    // Ek kontrol: Sayfa başlığını kontrol et
    const pageTitle = document.title.toLowerCase();
    const isVariantUrl = pageTitle.includes('varyant') || 
                         window.location.href.includes('variant') ||
                         window.location.href.includes('varyant');
    
    const result = hasVariants && isVariantUrl;
    
    if (result) {
        console.log('✅ Varyant sayfasında olduğunuz doğrulandı');
    } else {
        console.warn('⚠️ Bu sayfa varyant sayfası değil');
    }
    
    return result;
}

// ===================================================================
// MODÜL EXPORT KONTROLÜ
// ===================================================================
// Global scope'a export et (Manifest V3 content script için)
window.DOMFinder = {
    findVariantRows,
    getVariantName,
    findPriceInput,
    findAllPriceInputs,
    findStockButton,
    findImageButton,
    findStockSaveButton,
    findSaveButton,
    openStockPopup,
    openImagePopup,
    waitForImagePreview,
    closeStockPopup,
    getVariantCount,
    isVariantPage
};

console.log('✅ domFinder.js modülü yüklendi');
console.log('✅ DOMFinder fonksiyonları:', Object.keys(window.DOMFinder));

    })();
}
