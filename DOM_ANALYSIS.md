# DOM Analysis Report - Ikas Varyant Sayfası
**Analiz Tarihi:** 14 Şubat 2026  
**Hedef URL:** `https://*.ikas.com/*/varyantli-urun-ekle` (veya benzeri)  
**Framework:** React + Ant Design + Styled Components

---

## 🎯 Kritik HTML Yapısı

### 1. Varyant Listesi Container
```html
<div class="sc-ejmaJG iCXffg data-table-row">
    <!-- Her satır bir varyant -->
</div>
```

**Özellikleri:**
- Her varyant ayrı bir row
- Tablo yapısı (Ant Design Table component)
- Kolonlar: Varyantlar | Satış Fiyatı | İndirimli Fiyat | Alış Fiyatı | SKU | Barkod | Stoklar

---

### 2. Varyant İsmi (Her Satırdaki)
```html
<span class="ant-typography ant-typography-ellipsis ant-typography-single-line css-1lrkwla">
    iPhone 17 Pro Max
</span>
```

**Selector Stratejisi:**
```javascript
// Priority 1: Semantic class
const variantNames = document.querySelectorAll('.ant-typography-single-line');

// Priority 2: Fallback
const variantNames = document.querySelectorAll('[class*="typography-ellipsis"]');

// Priority 3: Context-aware (sadece varyant kolonundaki)
const table = document.querySelector('[class*="data-table"]');
const rows = table.querySelectorAll('[class*="data-table-row"]');
rows.forEach(row => {
    const nameSpan = row.querySelector('.ant-typography-single-line');
    console.log(nameSpan.textContent); // "iPhone 17 Pro Max"
});
```

**Mühendislik Notu (Veysel için):**
> **Neden context-aware selector kullanıyoruz?**  
> Sayfada başka yerlerde de `.ant-typography-single-line` olabilir (başlık, menü vs). Sadece varyant tablosundakileri bulmak için önce table container'ı buluyoruz, sonra onun içinde arıyoruz. Bu "scope limiting" stratejisi, yanlış element seçimini önler.

---

### 3. Fiyat Input (Satış Fiyatı)

**HTML:**
```html
<div class="ant-form-item-control-input-content">
    <div class="sc-cxWPqV kBjqYB ikas-price-input-wrapper" 
         sc-HtPrR ilfrFp" 
         data-type="ikas-input-component">
        <input 
            type="text" 
            class="sc-gqtkzN h YTWQ ikas-price-input" 
            value="== $0"
        />
        <span class="sc-eBFsE dYMoMo ikas-price-input-prefix">
            $
        </span>
    </div>
</div>
```

**Selector Stratejisi:**
```javascript
// 🥇 BEST: Semantic class (ikas-specific)
const priceInputs = document.querySelectorAll('input.ikas-price-input');

// 🥈 GOOD: Wrapper attribute
const wrappers = document.querySelectorAll('[data-type="ikas-input-component"]');
wrappers.forEach(wrapper => {
    const input = wrapper.querySelector('input[type="text"]');
});

// 🥉 FALLBACK: Styled Components class pattern
const scInputs = document.querySelectorAll('input[class*="sc-"][class*="ikas-price"]');
```

**React State Trigger:**
```javascript
function setReactInputValue(input, value) {
    // Native setter'ı al
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
    ).set;
    
    // Değeri set et
    nativeInputValueSetter.call(input, value);
    
    // Multiple event dispatch (React farklı event'leri dinleyebilir)
    ['input', 'change', 'blur'].forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        input.dispatchEvent(event);
    });
}
```

**Öğretici Not:**
> **Neden 3 farklı event?**
> - `input`: Gerçek zamanlı değişiklik (onChange tetikler)
> - `change`: Input blur olduğunda (form validation tetikler)
> - `blur`: Focus kaybı (onBlur handler'ları tetikler)
> 
> Hangi event'i kullandıklarını bilmiyorsak, hepsini tetikleriz. "Better safe than sorry" prensibi.

---

### 4. Stok Input

**HTML (Popup/Drawer İçinde):**
```html
<div class="ant-drawer-content">
    <form class="ant-form ant-form-vertical css-1lrkwla">
        <div class="ant-form-item ant-form-item-row ant-form-item-row css-1lrkwla">
            <div class="ant-col ant-form-item-control css-1lrkwla">
                <div class="ant-form-item-control-input">
                    <div class="ant-form-item-control-input-content">
                        <div class="sc-fIyAVD eZzgDP ikas-masked-input-wrapper" 
                             data-type="ikas-input-component">
                            <input 
                                type="text" 
                                dir="ltr" 
                                class="sc-hxtlGJ iEHGXP" 
                                value="0 == $0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
```

**Stok Popup Açma:**
```html
<button 
    class="style__StockColumnButton-sc-dfly1s-11 eVfigM" 
    style="...">
    0 adet
    <br/>
    <span>0 lokasyon</span>
</button>
```

**Selector Stratejisi:**
```javascript
// 1. Önce popup'ı aç
const stockButton = row.querySelector('button[class*="StockColumnButton"]');
stockButton.click();

// 2. Popup yüklenmesini bekle (MutationObserver veya setTimeout)
await waitForElement('.ant-drawer-content');

// 3. Stok inputunu bul
const stockInput = document.querySelector('.ikas-masked-input-wrapper input[dir="ltr"]');

// 4. Değeri güncelle
setReactInputValue(stockInput, '10000');

// 5. Kaydet butonuna bas
const saveButton = document.querySelector('.ant-drawer-footer button.ant-btn-primary');
saveButton.click();
```

**Önemli Not:**
> Stok input'u lazy load! Popup açılmadan DOM'da yok. Bu yüzden async operation gerekiyor.

---

### 5. Görsel Yükleme Alanı

**HTML (Popup/Drawer İçinde):**
```html
<div class="ant-drawer-content sc-erFxs dcGGGd" aria-modal="true">
    <div class="ant-drawer-body">
        <div class="style__Container-sc-8zwB1-0 jMaAbP">
            <span class="ant-upload-wrapper css-1lrkwla">
                <div class="ant-upload ant-upload-drag css-1lrkwla">
                    <span tabindex="0" class="ant-upload ant-upload-btn" role="button">
                        <input 
                            type="file" 
                            accept="video/mp4,image/jpg,image/jpeg,image/png,image/webp,image/heic,image/heif" 
                            multiple 
                            style="display: none;"
                        />
                        <div class="ant-upload-drag-container">
                            <p class="ant-upload-drag-icon">
                                <span class="sc-clWlTH kNdGXw"></span>
                            </p>
                            <div class="sc-igVes dKLieA">
                                <button type="button" class="ant-btn css-1lrkwla ant-btn-link">
                                    <span class="ant-btn-icon">
                                        <svg>...</svg>
                                    </span>
                                    <span>Görsel Ekle</span>
                                </button>
                            </div>
                        </div>
                    </span>
                </div>
            </span>
        </div>
    </div>
</div>
```

**Görsel Popup Açma:**
```html
<button type="button" 
        class="ant-btn css-1lrkwla ant-btn-link ant-btn-icon-only sc-fFeiM Q cYxCK">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"></svg>
</button>
```

**Selector & Upload Stratejisi:**
```javascript
// 1. Görsel ekle butonunu bul (varyant satırında)
const imageButton = row.querySelector('button[class*="EmptyThumbnail"]') 
                    || row.querySelector('button:has(svg)');
imageButton.click();

// 2. Drawer yüklenmesini bekle
await waitForElement('.ant-drawer-content[aria-modal="true"]');

// 3. File input veya drag-drop zone'u bul
const fileInput = document.querySelector('input[type="file"][accept*="image"]');
const dragZone = document.querySelector('.ant-upload-drag-container');

// 4. Dosyaları yükle (2 yöntem)

// YÖNTEM A: File input kullan (daha stabil)
const files = await getFilesFromFolder(variantFolderPath);
const dataTransfer = new DataTransfer();
files.forEach(file => dataTransfer.items.add(file));
fileInput.files = dataTransfer.files;
fileInput.dispatchEvent(new Event('change', { bubbles: true }));

// YÖNTEM B: Drag-drop simüle et (daha gerçekçi)
const dropEvent = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    dataTransfer: dataTransfer
});
dragZone.dispatchEvent(dropEvent);
```

**Kritik Bulgu:**
- Her varyant için ayrı popup açılıyor
- Aynı anda birden fazla görsel yüklenebilir (`multiple` attribute)
- Desteklenen formatlar: jpg, jpeg, png, webp, heic, heif, mp4

---

## 🔍 Selector Öncelik Matrisi

| Element | Priority 1 (En Güvenilir) | Priority 2 | Priority 3 |
|---------|--------------------------|------------|------------|
| **Varyant İsmi** | `.ant-typography-single-line` | `[class*="typography-ellipsis"]` | `row span:first-child` |
| **Fiyat Input** | `input.ikas-price-input` | `[data-type*="price"] input` | `input[class*="sc-"][class*="price"]` |
| **Stok Input** | `.ikas-masked-input-wrapper input` | `input[dir="ltr"]` | `.ant-drawer input[type="text"]` |
| **Görsel Upload** | `input[type="file"][accept*="image"]` | `.ant-upload-drag-container` | `.ant-upload-btn` |

---

## 🚨 Risk & Mitigasyon

### Risk 1: Styled Components Class İsimleri Değişir
**Örnek:** `sc-gqtkzN` → `sc-abc123` (her build'de değişebilir)

**Mitigasyon:**
- ✅ Semantic class'ları kullan (`ikas-price-input`, `ant-typography`)
- ✅ Attribute selector'ları tercih et (`data-type`, `aria-*`)
- ❌ Styled Components class'larına güvenme

### Risk 2: Lazy Loading (Popup içindeki elementler)
**Örnek:** Stok/Görsel input'ları popup açılmadan DOM'da yok

**Mitigasyon:**
```javascript
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        // Önce kontrol et, belki zaten var
        const existing = document.querySelector(selector);
        if (existing) return resolve(existing);
        
        // MutationObserver ile DOM değişikliklerini izle
        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Timeout
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element bulunamadı: ${selector}`));
        }, timeout);
    });
}
```

### Risk 3: React State Sync Hatası
**Örnek:** Input değeri değişiyor ama form submit edilemiyor

**Mitigasyon:**
- Multiple event dispatch (input + change + blur)
- Native setter kullanımı
- Test: Form submit et, Network sekmesinde POST data'yı kontrol et

---

## 📝 Mentorluk Notu: Modern Web Scraping Best Practices

**Veysel için öğretici kısım:**

### 1. Selector Stability Hiyerarşisi
```
Semantic Attribute > ARIA > Data Attribute > Semantic Class > Generic Class > ID > Styled Class
```

**Örnek:**
```javascript
// ✅ BEST: Standard HTML attribute
input[type="email"]

// ✅ GOOD: Semantic attribute
input[name="userEmail"]

// ✅ GOOD: ARIA (accessibility standard)
input[aria-label="Email"]

// ⚠️ OK: Custom data attribute (developer might change)
input[data-testid="email-field"]

// ⚠️ RISKY: Semantic class (CSS refactor might change)
.email-input

// ❌ VERY RISKY: Generic class
.input-field

// ❌ DON'T USE: Dynamic class (changes every build)
.css-abc123
```

### 2. React State Management Pattern
```javascript
// ❌ YANLIŞ: Sadece DOM manipülasyonu
input.value = "1299";

// ⚠️ YETERSIZ: Event dispatch var ama native setter yok
input.value = "1299";
input.dispatchEvent(new Event('input', { bubbles: true }));

// ✅ DOĞRU: Native setter + multiple events
const nativeValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
).set;
nativeValueSetter.call(input, "1299");
input.dispatchEvent(new Event('input', { bubbles: true }));
input.dispatchEvent(new Event('change', { bubbles: true }));
```

**Neden bu kadar karmaşık?**
> React, performans için virtual DOM kullanır. Gerçek DOM'a yaptığın değişiklik, React'in bilgisi dışında kalır. React state'i güncellemenin tek yolu, React'in event handler'larını tetiklemek. Native setter + event dispatch, tam da bunu yapar.

### 3. Async DOM Operations
```javascript
// ❌ YANLIŞ: Element hemen var sanıyorsun
button.click();
const input = document.querySelector('.popup-input'); // null!
input.value = "1299"; // Error!

// ⚠️ KÖTÜ: Arbitrary timeout (bazen yetmeyebilir)
button.click();
setTimeout(() => {
    const input = document.querySelector('.popup-input');
    input.value = "1299";
}, 1000); // Yavaş internet bağlantısında fail!

// ✅ DOĞRU: MutationObserver ile bekle
button.click();
const input = await waitForElement('.popup-input', 5000);
setReactInputValue(input, "1299");
```

---

## 🎯 Sonraki Adım: Modül İmplementasyonu

Bu analiz doğrultusunda şu modüller oluşturulacak:

1. **`modules/domFinder.js`**
   - `findVariantRows()`: Varyant satırlarını bul
   - `findVariantName(row)`: Satırdaki varyant ismini al
   - `findPriceInput(row)`: Fiyat inputunu bul
   - `openStockPopup(row)`: Stok popup'ını aç ve inputu döndür
   - `openImagePopup(row)`: Görsel popup'ını aç ve upload zone'u döndür

2. **`modules/reactHelper.js`**
   - `setInputValue(input, value)`: React-safe input güncelleme
   - `waitForElement(selector, timeout)`: Async element bekleme
   - `verifyStateUpdate(input)`: State güncellendiğini doğrula

3. **`modules/fileHandler.js`**
   - `selectRootDirectory()`: Ana klasörü seç
   - `selectDesign(rootHandle)`: Tasarım klasörünü seç
   - `listVariantFolders(designHandle)`: Varyant klasörlerini listele
   - `matchFolderToVariant(folderName, variantName)`: Eşleştirme
   - `getImagesFromFolder(folderHandle)`: Görselleri al

4. **`modules/imageUploader.js`**
   - `uploadImagesToVariant(row, files)`: Görselleri yükle
   - `simulateDragDrop(zone, files)`: Drag-drop simüle et

---

**Analiz Sahibi:** Kıdemli Yazılım Mimarı  
**Doğrulama:** Gerçek Ikas screenshot'larından alındı ✅  
**Durum:** Implementation için hazır 🚀
