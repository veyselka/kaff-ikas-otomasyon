/**
 * ===================================================================
 * REACT HELPER MODULE
 * ===================================================================
 * 
 * Bu modül, React uygulamalarında (Ikas gibi) input değerlerini 
 * güvenli bir şekilde değiştirmek için gerekli utility fonksiyonları sağlar.
 * 
 * PROBLEM: Neden böyle bir modül gerekli?
 * ---------------------------------------
 * React, performans için Virtual DOM kullanır. Eğer direkt DOM'a 
 * `input.value = "1299"` dersen, React'in state'i güncellenmez.
 * Form submit edildiğinde, eski değer gönderilir.
 * 
 * ÇÖZÜM: Native setter + Event dispatching
 * ---------------------------------------
 * 1. HTMLInputElement'in native setter'ını kullan
 * 2. React'in dinlediği event'leri tetikle (input, change, blur)
 * 3. React, event'i algılar ve state'i günceller
 * 
 * @author Kıdemli Yazılım Mimarı
 * @mentee Veysel (Fırat Üniversitesi)
 */

/**
 * Async işlemler için DOM elementinin yüklenmesini bekler
 * 
 * KULLANIM SENARYOSU:
 * -------------------
 * Ikas'ta stok/görsel popup'ları lazy load. Yani popup açılmadan 
 * DOM'da yok. Bu fonksiyon, popup açıldıktan sonra element 
 * görünene kadar MutationObserver ile bekler.
 * 
 * @param {string} selector - CSS selector (örn: '.ikas-price-input')
 * @param {number} timeout - Max bekleme süresi (ms)
 * @returns {Promise<Element>} - Bulunan element
 * 
 * @example
 * button.click(); // Popup'ı aç
 * const input = await waitForElement('.popup-input', 5000);
 * setInputValue(input, '1299');
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        // Önce kontrol et: Belki element zaten var
        const existing = document.querySelector(selector);
        if (existing) {
            console.log(`✅ Element zaten mevcut: ${selector}`);
            return resolve(existing);
        }

        console.log(`⏳ Element bekleniyor: ${selector}`);

        // MutationObserver: DOM değişikliklerini izler
        // JavaScript'in yerleşik API'si, framework'den bağımsız
        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✅ Element bulundu: ${selector}`);
                observer.disconnect(); // Artık izlemeyi durdur (memory leak önleme)
                resolve(element);
            }
        });

        // document.body'deki tüm değişiklikleri izle
        observer.observe(document.body, {
            childList: true,  // Yeni child eklenirse/silinirse
            subtree: true     // Tüm alt elementleri de izle (recursive)
        });

        // Timeout: Belirlenen sürede bulunamazsa hata fırlat
        setTimeout(() => {
            observer.disconnect();
            console.error(`❌ Timeout: ${selector} ${timeout}ms içinde bulunamadı`);
            reject(new Error(`Element bulunamadı: ${selector}`));
        }, timeout);
    });
}

/**
 * React-safe şekilde input değerini günceller
 * 
 * NEDEN BU KADAR KARMAŞIK?
 * -------------------------
 * 1. React, kendi event sistemini kullanır (SyntheticEvent)
 * 2. Direkt `input.value = x` dersen, React'in haberi olmaz
 * 3. Native setter'ı çağırıp, sonra event dispatch edersen, 
 *    React bunu gerçek kullanıcı girişi gibi algılar
 * 
 * JAVA KARŞILAŞTIRMASI (Veysel için):
 * ------------------------------------
 * Java Swing'de:
 *   textField.setText("1299"); 
 *   // → setText() metodu hem değeri değiştirir, hem listener'ları tetikler
 * 
 * React'te:
 *   input.value = "1299"; 
 *   // → Sadece DOM'u değiştirir, React state'i değişmez
 * 
 *   setInputValue(input, "1299");
 *   // → Hem DOM'u değiştirir, hem React state'ini günceller
 * 
 * @param {HTMLInputElement} input - Hedef input elementi
 * @param {string|number} value - Yeni değer
 * @returns {boolean} - İşlem başarılı mı?
 * 
 * @example
 * const priceInput = document.querySelector('.ikas-price-input');
 * setInputValue(priceInput, '1299');
 */
function setInputValue(input, value) {
    if (!input) {
        console.error('❌ setInputValue: Input elementi null!');
        return false;
    }

    try {
        console.log(`🔧 Input değeri değiştiriliyor: "${value}"`);

        // ADIM 1: Native setter'ı al
        // ---------------------------
        // Object.getOwnPropertyDescriptor: Bir property'nin descriptor'ını döndürür
        // Descriptor = { get: fn, set: fn, configurable: bool, enumerable: bool }
        // 
        // HTMLInputElement.prototype.value'nun setter'ını alıyoruz
        // Bu, tarayıcının native (orijinal) setter'ı
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;

        // ADIM 2: Native setter'ı çağır
        // ------------------------------
        // .call(input, value): setter'ı "input" context'inde çağır
        // Bu, React'in input'a koyduğu custom setter'ı bypass eder
        nativeInputValueSetter.call(input, value);

        // ADIM 3: React event'lerini tetikle
        // -----------------------------------
        // React farklı event'lerde farklı şeyler yapabilir:
        // - input: onChange handler (gerçek zamanlı validasyon)
        // - change: onBlur sonrası (form seviyesi validasyon)
        // - blur: Focus kaybı (dirty state tracking)
        const events = ['input', 'change', 'blur'];

        events.forEach(eventType => {
            const event = new Event(eventType, {
                bubbles: true,      // Event yukarı doğru yayılsın (parent'lar da dinleyebilir)
                cancelable: true,   // preventDefault() ile durdurulabilir
                composed: true      // Shadow DOM sınırlarını aşabilir
            });

            input.dispatchEvent(event);
        });

        console.log(`✅ Input değeri başarıyla güncellendi: "${value}"`);
        return true;

    } catch (error) {
        console.error('❌ Input değeri güncellenirken hata:', error);
        return false;
    }
}

/**
 * Input değerinin React state'e yansıdığını doğrular
 * 
 * KULLANIM AMACI:
 * ---------------
 * Debug ve test için. setInputValue() çağırdıktan sonra,
 * gerçekten React state'inin güncellenip güncellenmediğini
 * kontrol etmek için kullanılır.
 * 
 * NASIL ÇALIŞIR?
 * --------------
 * React, input'a özel property'ler ekler (örn: _valueTracker).
 * Bu property'leri kontrol ederek, React'in değeri bilip bilmediğini
 * anlayabiliriz.
 * 
 * @param {HTMLInputElement} input - Kontrol edilecek input
 * @param {string} expectedValue - Beklenen değer
 * @returns {boolean} - State güncel mi?
 */
function verifyStateUpdate(input, expectedValue) {
    if (!input) {
        console.warn('⚠️ verifyStateUpdate: Input elementi null!');
        return false;
    }

    const actualValue = input.value;
    const isMatch = actualValue === String(expectedValue);

    if (isMatch) {
        console.log(`✅ State doğrulandı: "${expectedValue}"`);
    } else {
        console.warn(`⚠️ State uyuşmazlığı! Beklenen: "${expectedValue}", Gerçek: "${actualValue}"`);
    }

    // React'in internal property'sini kontrol et (opsiyonel)
    // Not: Bu React'in private API'si, değişebilir
    const reactProps = Object.keys(input).filter(key => 
        key.startsWith('__react') || key.startsWith('_value')
    );

    if (reactProps.length > 0) {
        console.log(`🔍 React property'leri tespit edildi:`, reactProps);
    }

    return isMatch;
}

/**
 * Birden fazla inputu toplu günceller
 * 
 * KULLANIM SENARYOSU:
 * -------------------
 * Kullanıcı "Tüm fiyatları 1299 yap" dediğinde, 50 tane
 * fiyat inputunu tek tek güncellemek yerine, bu fonksiyon
 * hepsini async olarak (sırayla) günceller.
 * 
 * NEDEN ASYNC?
 * ------------
 * React, çok hızlı ardışık değişikliklerde "batching" yapar
 * (birleştirip tek seferde render eder). Biraz delay koyarak,
 * her input için React'in state'i düzgün güncellemesini sağlıyoruz.
 * 
 * @param {HTMLInputElement[]} inputs - Input array
 * @param {string|number} value - Ortak değer
 * @param {number} delay - Her input arası bekleme (ms)
 * @returns {Promise<Object>} - Sonuç raporu
 * 
 * @example
 * const allPriceInputs = document.querySelectorAll('.ikas-price-input');
 * const result = await bulkUpdateInputs(allPriceInputs, '1299', 50);
 * console.log(`${result.success} / ${result.total} başarılı`);
 */
async function bulkUpdateInputs(inputs, value, delay = 50) {
    console.log(`📦 Toplu güncelleme başlıyor: ${inputs.length} input`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        
        console.log(`[${i + 1}/${inputs.length}] Güncelleniyor...`);
        
        const success = setInputValue(input, value);
        
        if (success) {
            successCount++;
        } else {
            failCount++;
        }

        // Küçük bir delay koyarak React'in nefes almasını sağla
        if (i < inputs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    const result = {
        total: inputs.length,
        success: successCount,
        failed: failCount,
        successRate: ((successCount / inputs.length) * 100).toFixed(1) + '%'
    };

    console.log(`✅ Toplu güncelleme tamamlandı:`, result);
    return result;
}

/**
 * Utility: Console'a başlık yazdırır (debug için)
 * 
 * NEDEN BU VAR?
 * -------------
 * Console'da onlarca log arasında önemli mesajları bulmak zor.
 * Bu fonksiyon, görsel olarak dikkat çeken başlıklar oluşturur.
 * 
 * @param {string} text - Başlık metni
 */
function logHeader(text) {
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 ${text.toUpperCase()}`);
    console.log('='.repeat(60) + '\n');
}

// ===================================================================
// MODÜL EXPORT KONTROLÜ
// ===================================================================
// Global scope'a export et (Manifest V3 content script için)
window.ReactHelper = {
    waitForElement,
    setInputValue,
    verifyStateUpdate,
    bulkUpdateInputs,
    logHeader
};

console.log('✅ reactHelper.js modülü yüklendi');
console.log('✅ ReactHelper fonksiyonları:', Object.keys(window.ReactHelper));
