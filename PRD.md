# Product Requirements Document (PRD)
## KAFF İkas Otomasyonu - Chrome Extension

**Proje Sahibi:** Veysel (Fırat Üniversitesi - Bilgisayar Mühendisliği)  
**Mimar:** Kıdemli Yazılım Mimarı (Google/Amazon Background)  
**Tarih:** 14 Şubat 2026  
**Versiyon:** 1.0.0

---

## 1. Executive Summary

KAFF İkas Otomasyonu, **Ikas E-ticaret Platformu**'ndaki ürün varyantı yönetim süreçlerini otomatize eden bir Chrome Extension'dır. Hedef kullanıcılar, yüzlerce varyanta sahip ürünleri manuel olarak yönetmek zorunda kalan e-ticaret yöneticileridir.

**Kritik İş Değeri:**
- Manuel bir işlem: ~5 dakika/varyant → Otomatik: ~5 saniye/varyant
- Hata oranını %40'tan %2'ye düşürme (insan hatası eliminasyonu)
- Görsel yükleme sürecini 10x hızlandırma

---

## 2. Teknik Gereksinimler

### 2.1 Platform & Mimari
- **Hedef Platform:** Ikas (React-based SPA)
- **Extension Mimarisi:** Manifest V3 (Chrome Extensions)
- **JavaScript:** ES6+ (Modern syntax)
- **Security:** Content Security Policy (CSP) uyumlu

### 2.2 Zorunlu Teknik Kısıtlar

#### **A) React State Yönetimi**
**Problem:** Ikas platformu React kullanıyor. Standart DOM manipülasyonu (`input.value = "1299"`) React'in virtual DOM'unu bypass eder ve state'i güncellemez.

**Çözüm:** React-compatible input manipulation:
```javascript
// ❌ YANLIŞ: React state'i tetiklemez
input.value = "1299"; 

// ✅ DOĞRU: React state'ini senkronize eder
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 
    "value"
).set;
nativeInputValueSetter.call(input, "1299");
input.dispatchEvent(new Event('input', { bubbles: true }));
```

**Öğretici Notu (Veysel için):**
> **Neden böyle yapıyoruz?**  
> React, performans için virtual DOM kullanır. Direkt DOM manipülasyonu, React'in bilgisi dışında kalır. `Object.getOwnPropertyDescriptor` ile native setter'ı alıp, `dispatchEvent` ile React'e "ben değer değiştirdim, state'i güncelle" sinyali veriyoruz. Bu pattern, tüm modern framework'lerle (Vue, Angular) çalışırken kritik!

#### **B) File System Access API**
**Gereksinim:** Kullanıcı yerel bilgisayarındaki bir klasörü seçer, extension bu klasördeki görselleri tarayıcıya "sürükle-bırak" simüle ederek yükler.

**API:** `window.showDirectoryPicker()` (Chrome 86+)

**Security Risk:** Dosya sistemine erişim, en yüksek güvenlik riskidir. Sadece **user-initiated** (kullanıcı butona tıkladığında) kullanılmalı.

#### **C) Manifest V3 Gereksinimleri**
- **No eval():** `unsafe-eval` yasak
- **No remote code:** CDN'den script yüklenemez
- **CSP Compliance:** Inline script yasak (`onclick="..."` gibi)

---

## 3. Kullanıcı Hikayeleri

### 3.1 Hikaye #1: Toplu Fiyat Güncelleme
**Kim:** E-ticaret yöneticisi  
**Ne:** 50 varyantın fiyatını tek seferde 1299 TL yapmak istiyor  
**Neden:** Manuel olarak her input'a tıklayıp yazmak 10 dakika alıyor  

**Acceptance Criteria:**
- Kullanıcı popup'tan "Fiyat: 1299" girer
- "Güncelle" butonuna basar
- Tüm fiyat input'ları 1299 olur
- ✅ React state'i güncellenir (form submit edilebilir)

### 3.2 Hikaye #2: Toplu Stok Güncelleme
**Kim:** Depo sorumlusu  
**Ne:** Yeni gelen parti için 100 varyantın stok sayısını 10000 yapmak istiyor  

**Acceptance Criteria:**
- Kullanıcı popup'tan "Stok: 10000" girer
- "Güncelle" butonuna basar
- Tüm stok input'ları 10000 olur
- ✅ React state'i güncellenir

### 3.3 Hikaye #3: Otomatik Görsel Eşleştirme 🔥 (KRITIK)
**Kim:** Ürün yöneticisi  
**Ne:** 200 varyantın görsellerini yüklemek istiyor (her varyant için ayrı görsel)  
**Neden:** Manuel sürükle-bırak 2 saat alıyor ve bazen yanlış görseli yanlış varyanta yüklüyor  

**Teknik Gereksinim:**
1. Kullanıcı "Klasör Seç" butonuna basar → `showDirectoryPicker()` açılır
2. Örnek klasör yapısı:
   ```
   /Gorsel_Klasoru/
       ├── Siyah-S.jpg
       ├── Siyah-M.jpg
       ├── Beyaz-S.jpg
       └── Mavi-L.png
   ```
3. Extension, DOM'daki varyant isimlerini (örn: "Siyah - S") tarar
4. Dosya ismiyle eşleşenleri bulur (fuzzy matching gerekebilir)
5. Her eşleşen görseli ilgili varyantın görsel yükleme alanına "sürükle-bırak" simüle eder

**Acceptance Criteria:**
- Kullanıcı klasör seçer
- Extension otomatik eşleştirme yapar
- Konsola rapor yazdırır: "✅ 180/200 eşleşme bulundu"
- Görseller doğru varyantlara yüklenir
- ❌ Eşleşmeyenler için uyarı verir

---

## 4. Teknik Mimari

### 4.1 Dosya Yapısı
```
kaff-ikas-otomasyon/
├── manifest.json          # Extension metadata & permissions
├── popup.html            # User Interface
├── popup.js              # UI logic & messaging
├── content.js            # Main orchestrator (DOM manipulation)
├── modules/
│   ├── domFinder.js      # DOM element selector logic
│   ├── reactHelper.js    # React state manipulation utilities
│   ├── fileHandler.js    # File System Access API wrapper
│   └── imageUploader.js  # Drag-drop simulation
├── PRD.md               # Bu dosya
└── TASKS.md             # Development roadmap
```

**Modüler Tasarım Prensibi (Veysel için):**
> Tüm kodu `content.js`'e yığmak yerine, her sorumluluğu ayrı modüle ayırıyoruz. Bu:  
> 1. **Testable:** Her modülü izole test edebiliriz
> 2. **Maintainable:** 6 ay sonra kodu okuduğunda ne olduğunu anlarsın
> 3. **Scalable:** Yeni özellik eklerken mevcut kodu bozmadan eklersin
> 
> Örnek: `domFinder.js` sadece "input elemanlarını bul" işinden sorumlu. Yarın Ikas HTML'ini değiştirse, sadece o dosyayı düzenlersin.

### 4.2 İletişim Mimarisi
```
[User] → [popup.html] 
           ↓ (chrome.tabs.sendMessage)
       [content.js] 
           ↓ (orchestrates)
       [modules/domFinder.js] → DOM'dan input'ları bul
       [modules/reactHelper.js] → Input'ları güncelle
       [modules/fileHandler.js] → Dosyaları oku
       [modules/imageUploader.js] → Görselleri yükle
```

### 4.3 Güvenlik Modeli
1. **Input Validation:** Kullanıcı girişlerini sanitize et (fiyat için regex: `/^\d+(\.\d{2})?$/`)
2. **Origin Check:** Sadece `ikas.com` üzerinde çalış
3. **Permission Minimal:** Sadece gerekli permission'ları iste
4. **No eval():** Dinamik kod çalıştırma yasak
5. **File Access:** Sadece user-initiated (button click) dosya erişimi

---

## 5. DOM Manipülasyon Stratejisi

### 5.1 Selector Strategy
Ikas React kullandığı için, class isimleri dinamik olabilir (örn: `css-abc123`). 

**Çözüm:** Semantic attribute'lara güven:
```javascript
// ❌ KIRILGAN: Class isimleri değişebilir
document.querySelector('.css-abc123-input')

// ✅ SAĞLAM: Attribute selector veya aria-label
document.querySelector('input[name="price"]')
document.querySelector('input[aria-label*="Fiyat"]')
```

### 5.2 DOM İzleme (Mutation Observer)
SPA'lerde sayfa yenilenmeden içerik değişir. İçerik yavaş yükleniyorsa (lazy load), elementleri bulamayabiliriz.

**Çözüm:** `MutationObserver` ile DOM değişikliklerini izle:
```javascript
const observer = new MutationObserver((mutations) => {
    // Yeni varyant input'ları eklendi mi?
    if (document.querySelectorAll('input[name="price"]').length > 0) {
        // İşlemi başlat
    }
});
observer.observe(document.body, { childList: true, subtree: true });
```

---

## 6. Risk & Mitigasyon

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|------------|
| Ikas HTML yapısı değişir | Yüksek | Yüksek | Semantic selector'lar kullan + test suite |
| Dosya isimlendirmesi tutarsız | Orta | Yüksek | Fuzzy matching algoritması (Levenshtein distance) |
| React state sync olmazsa | Orta | Kritik | Native setter + multiple event types (input, change, blur) |
| File System API desteklenmiyor (eski Chrome) | Düşük | Orta | Version check + fallback mesajı |

---

## 7. Test Planı

### 7.1 Unit Tests (Jest)
- `reactHelper.js`: State update doğru tetikleniyor mu?
- `fileHandler.js`: Dosya okuma hatasız çalışıyor mu?

### 7.2 Integration Tests
- Popup → Content script mesajlaşması
- DOM bulma + değer güncelleme end-to-end

### 7.3 Manual Test Scenarios
1. 10 varyantlı ürün oluştur
2. Fiyat güncellemeyi test et
3. Stok güncellemeyi test et
4. Görsel yüklemeyi test et (5 eşleşen, 2 eşleşmeyen dosya)
5. Formu submit et → Backend'e doğru veri gidiyor mu?

---

## 8. KRITIK SORULAR (Kodlamadan Önce Cevaplanmalı)

### ❓ Soru 1: Görsel İsimlendirme Formatı
**Problem:** Dosya isimlerini varyant ismiyle nasıl eşleştireceğiz?

**Seçenekler:**
- A) Exact match: "Siyah-S.jpg" → Varyant ismi: "Siyah-S"
- B) Fuzzy match: "siyah_s.jpg" → "Siyah - S" (küçük harf, tire/underscore farkı ignore)
- C) Manuel mapping: Kullanıcı CSV yükler (dosya_ismi,varyant_id)

**Veysel'den Beklenen:**
> Gerçek KAFF projesinde görseller nasıl isimlendiriliyor? Örnek 3-5 dosya ismi paylaş.

### ❓ Soru 2: Varyant Sayfa Yapısı
**Problem:** Ikas'ta varyant ekleme sayfası nasıl görünüyor?

**Bilmemiz Gerekenler:**
- Varyantlar bir tablo içinde mi yoksa accordion/tabs gibi bir yapıda mı?
- Her varyantın inputları bir `<div>` veya `<form>` içinde mi gruplu?
- Varyant ismi nerede yazıyor? (Başlık olarak mı, yoksa gizli input'ta mı?)
- Görsel yükleme alanı input[type="file"] mi yoksa sürükle-bırak zone'u mu?

**Veysel'den Beklenen:**
> Ikas panel screenshot'ı veya ilgili sayfanın HTML'ini (DevTools > Elements) paylaş. Özellikle:
> 1. Fiyat input'unun HTML'i
> 2. Stok input'unun HTML'i
> 3. Görsel yükleme alanının HTML'i
> 4. Varyant isminin nerede gösterildiği

### ❓ Soru 3: Hata Senaryoları
**Problem:** Kullanıcı yanlış klasör seçerse veya dosya bulunamazsa ne olsun?

**Seçenekler:**
- A) Tüm işlemi iptal et, hata mesajı göster
- B) Eşleşenleri yükle, eşleşmeyenler için rapor ver, devam et
- C) Her eşleşmeyen için kullanıcıya "Manuel seç" popup'ı aç

**Veysel'den Beklenen:**
> Kullanıcı deneyimi açısından hangisi tercih edilmeli? KAFF kullanıcıları teknik bilgiye sahip mi yoksa basit mesajlar mı görmeli?

---

## 8.1 📋 SORULARIN CEVAPLARI (14 Şubat 2026 - Veysel'den Alındı)

### ✅ **Soru 1 Cevabı: Görsel İsimlendirme ve Klasör Yapısı**

**Gerçek Klasör Yapısı:**
```
Kaff Tüm tasarımlar otomasyon çıktıları/
├── Wild Flow/
├── White Empress/
├── Witchora/
├── Woodland Magic/
└── Wild Essence/
    ├── 1-17 Pro Max - Pro/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── 3.jpg
    ├── 3-16 Pro Max/
    ├── 4-16/
    ├── 5-13/
    ├── 6-11/
    ├── 7-S25-S24-S23-S22 Ultra/
    ├── 8-S25 Plus - S23 - S24 Plus-S24- S24 FE .../
    ├── 9-S25 Plus-s23-/
    ├── 10-s22 - s22 Plus/
    ├── 11-A53 - A52 - A52S 4G - JG Case - A33 .../
    └── 12-A51/
```

**Kritik Bulgu:**
- **3 katmanlı yapı var:** Ana klasör → Tasarım klasörü → Varyant klasörü → Görseller
- **Varyant klasör isimlendirmesi:** Numara + tire + varyant ismi (örn: "1-17 Pro Max - Pro")
- **Görsel isimlendirmesi:** Sadece numara.jpg formatında (1.jpg, 2.jpg, 3.jpg)

**Eşleştirme Stratejisi:**
1. Kullanıcı ana klasörü seçecek ("Kaff Tüm tasarımlar otomasyon çıktıları")
2. İlk önce hangi tasarımı yükleyeceğini seçecek (örn: "Wild Essence")
3. Extension, "Wild Essence" içindeki klasör isimlerini (1-17 Pro Max - Pro) varyant isimleriyle (iPhone 17 Pro Max) eşleştirecek
4. Her varyant için o klasördeki tüm görselleri (1.jpg, 2.jpg, 3.jpg) yükleyecek

**Matching Algorithm:**
```javascript
// Örnek: "1-17 Pro Max - Pro" → "iPhone 17 Pro Max" eşleşmesi
// Stratejimiz: Klasör ismindeki numarayı at, kalan kısmı normalize et
function normalizeForMatching(str) {
    return str
        .replace(/^\d+-/, '') // Baştaki "1-" gibi numarayı kaldır
        .replace(/[-_]/g, ' ') // Tire ve underscore'ları boşluğa çevir
        .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluk yap
        .toLowerCase() // Küçük harfe çevir
        .trim();
}
// "1-17 Pro Max - Pro" → "17 pro max   pro"
// "iPhone 17 Pro Max" → "iphone 17 pro max"
// Fuzzy match ile eşleştir
```

---

### ✅ **Soru 2 Cevabı: Ikas Varyant Sayfası HTML Yapısı**

**1. Varyant İsmi:**
```html
<span class="ant-typography ant-typography-ellipsis ant-typography-single-line css-1lrkwla">
    iPhone 17 Pro Max
</span>
```
**Selector Stratejisi:** 
- `.ant-typography.ant-typography-single-line` (Her satırdaki varyant ismi)
- Parent element: Varyant satırı (`data-table-row` içinde)

---

**2. Fiyat Input (Satış Fiyatı):**
```html
<div class="sc-cxWPqV kBjqYB ikas-price-input-wrapper" data-type="ikas-input-component">
    <input 
        type="text" 
        class="sc-gqtkzN h YTWQ ikas-price-input" 
        value="== $0"
    />
</div>
```
**Selector Stratejisi:**
- `input.ikas-price-input` ✅ (En güvenilir)
- `input[data-type*="ikas-input-component"]`
- Parent class: `.ikas-price-input-wrapper`

**Önemli Not:** Ant Design + Styled Components kullanıyor (sc-gqtkzN tarzı dinamik class'lar).

---

**3. Stok Input:**
```html
<div class="sc-fIyAVD eZzgDP ikas-masked-input-wrapper" data-type="ikas-input-component">
    <input 
        type="text" 
        dir="ltr" 
        class="sc-hxtlGJ iEHGXP" 
        value="0 == $0"
    />
</div>
```
**Selector Stratejisi:**
- `.ikas-masked-input-wrapper input` ✅
- `input[dir="ltr"]` (Stok için LTR direction kullanılıyor)
- Parent: `data-type="ikas-input-component"`

**Stok Input Bulma Yöntemi:**
- Stok inputu bir popup/drawer içinde açılıyor (button.style__StockColumnButton tıklanıyor)
- Popup açıldıktan sonra DOM'da görünüyor

---

**4. Görsel Yükleme Alanı:**
```html
<div class="ant-upload-drag-container">
    <span class="ant-upload-drag-icon">
        <span tabindex="0" class="ant-upload ant-upload-btn" role="button">
            <input 
                type="file" 
                accept="video/mp4,image/jpg,image/jpeg,image/png,image/webp,image/heic,image/heif" 
                multiple 
                style="display: none;"
            />
        </span>
    </span>
    <button type="button" class="ant-btn css-1lrkwla ant-btn-link sc-fFeJUM cYALqQ sc-hgJWpK qGCwu">
        <svg>...</svg>
        <span>Görsel Ekle</span>
    </button>
</div>
```
**Selector Stratejisi:**
- `input[type="file"][accept*="image"]` ✅
- `.ant-upload-drag-container`
- Button trigger: `button:has(span:contains("Görsel Ekle"))`

**Kritik Bulgu:** 
- `input[type="file"]` gizli (`display: none`)
- Drag-drop event'lerini `.ant-upload-drag-container` dinliyor
- Görseller her varyant için ayrı popup/drawer içinde

---

### ✅ **Soru 3 Cevabı: Hata Senaryosu Davranışı**

**Seçilen Yaklaşım: Hibrit (Alert + Manuel Seçim) - Option C Extended**

1. **İlk Aşama:** Otomatik eşleştirme çalıştır
2. **Eşleşme Raporu:** 
   ```javascript
   // Örnek çıktı
   {
       total: 10,
       matched: 6,
       unmatched: 4,
       unmatchedVariants: [
           "Samsung A23",
           "iPhone SE",
           "iPad Pro",
           "Xiaomi 13"
       ]
   }
   ```
3. **Kullanıcıya Bilgi:** Alert box ile:
   ```
   ✅ 6/10 varyant eşleşti
   ⚠️ 4 varyant için görsel bulunamadı:
   - Samsung A23
   - iPhone SE
   - iPad Pro
   - Xiaomi 13
   
   [Eşleşenleri Yükle]  [Manuel Seç]  [İptal]
   ```
4. **Manuel Seçim:** "Manuel Seç" butonuna basarsa:
   - Her eşleşmeyen varyant için sırayla `showOpenFilePicker()` aç
   - Kullanıcı doğru klasörü seçsin
   - Seçilen görselleri o varyanta yükle

---

### 🎯 **Mimari Kararlar (Bu Cevaplara Göre):**

#### **1. Dosya Sistemi Strateji Değişikliği**
```javascript
// ESKİ YAKLAŞIM (PRD'deki):
// window.showDirectoryPicker() → Tek klasör seç → Dosya ismiyle eşleştir

// YENİ YAKLAŞIM (Gerçek yapıya göre):
// 1. Ana klasörü seç ("Kaff Tüm tasarımlar...")
// 2. Tasarım seç (dropdown: Wild Essence, Wild Flow...)
// 3. Alt klasörleri tara (1-17 Pro Max - Pro, 3-16 Pro Max...)
// 4. Klasör isimleriyle varyant isimlerini eşleştir
// 5. Her eşleşen klasördeki TÜM görselleri yükle (1.jpg, 2.jpg, 3.jpg)
```

#### **2. Selector Öncelik Listesi**
```javascript
const SELECTORS = {
    variantName: [
        '.ant-typography.ant-typography-single-line', // Priority 1
        'span[class*="typography-ellipsis"]' // Priority 2
    ],
    priceInput: [
        'input.ikas-price-input', // Priority 1 ✅
        'input[data-type*="price"]' // Priority 2
    ],
    stockInput: [
        '.ikas-masked-input-wrapper input', // Priority 1 ✅
        'input[dir="ltr"]' // Priority 2
    ],
    imageUpload: [
        'input[type="file"][accept*="image"]', // Priority 1 ✅
        '.ant-upload-drag-container' // Priority 2 (for drag-drop)
    ]
};
```

#### **3. Görsel Yükleme Strateji**
- **Her varyant için ayrı popup açılıyor mı?** Evet (screenshot'tan anlaşılıyor)
- **Çözüm:** 
  1. Varyant satırına tıkla → "Görsel Ekle" popup'ını aç
  2. Drag-drop container'ı bul
  3. Bu varyant için eşleşen klasörü bul
  4. Klasördeki TÜM görselleri (1.jpg, 2.jpg, 3.jpg) tek seferde yükle
  5. Popup'ı kapat, sonraki varyanta geç

---

## 9. Success Metrics

**Quantitative:**
- ✅ 100 varyant işlemi: Manuel 50 dakika → Otomatik 5 dakika
- ✅ Hata oranı: %40 → %2
- ✅ Kod coverage: >80%

**Qualitative:**
- ✅ Kod okunabilirliği: Junior developer 30 dakikada anlayabilmeli
- ✅ Mentorluk değeri: Veysel, React state management'ı öğrenmiş olmalı
- ✅ Güvenlik: Hiçbir XSS/injection açığı yok

---

## 10. Roadmap

**Faz 1 (✅ Tamamlandı):** Setup & Validation  
**Faz 2 (🚀 Şimdi Başlıyoruz):** DOM Analysis & Selector Strategy  
**Faz 3:** Input Manipulation & React State  
**Faz 4:** File System Integration (3 Katmanlı Yapı)  
**Faz 5:** Image Upload Automation (Toplu Görsel Desteği)  
**Faz 6:** Error Handling & Manual Selection UI  
**Faz 7:** Testing & Documentation

---

**Doküman Sahibi:** Kıdemli Yazılım Mimarı  
**Son Güncelleme:** 14 Şubat 2026 - Veysel'in cevaplarıyla güncellendi ✅  
**Durum:** Requirements netleşti, kodlamaya hazır! 🎯
