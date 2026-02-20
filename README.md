# ⚡ KAFF İkas Otomasyonu

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-yellow.svg)

**KAFF İkas Otomasyonu**, İkas e-ticaret panelinde ürün varyantlarını toplu olarak yönetmenizi sağlayan güçlü bir Chrome Extension'dır. Fiyat güncelleme, stok kontrolü ve görsel yükleme işlemlerini tek tıkla gerçekleştirin!

> 📚 **Yeni Kullanıcı mısınız?** → Detaylı adım adım kılavuz için **[KULLANIM_TALIMATLARI.md](KULLANIM_TALIMATLARI.md)** dosyasını okuyun!

---

## 📑 Hızlı Erişim

### 📘 Dokümantasyon
- **[KULLANIM_TALIMATLARI.md](KULLANIM_TALIMATLARI.md)** - 🆕 Adım adım detaylı kullanım kılavuzu (Başlangıç için önerilen)
- **[PRD.md](PRD.md)** - Ürün gereksinimleri ve teknik detaylar
- **[TASKS.md](TASKS.md)** - Geliştirme yol haritası
- **[DOM_ANALYSIS.md](DOM_ANALYSIS.md)** - İkas DOM yapısı analizi

### 🚀 Hızlı Başlangıç İçin
1. [Kurulum](#-kurulum) - Extension'ı Chrome'a yükleme
2. [Kullanım Kılavuzu](#-kullanım-kılavuzu) - Temel özellikleri kullanma
3. [Sorun Giderme](#️-sorun-giderme) - Yaygın hataları çözme

---

---

## 🎯 Özellikler
- Tüm varyantların fiyatlarını tek seferde güncelleyin
- React state senkronizasyonu ile %100 uyumlu
- Anlık güncelleme ve doğrulama

### 📦 Toplu Stok Güncelleme
- Tüm varyantların stok miktarlarını aynı anda ayarlayın
- Otomatik popup açma/kapama
- Her varyant için kaydetme işlemi

### 🖼️ Otomatik Görsel Yükleme
- Klasör bazlı görsel organizasyonu
- Akıllı varyant eşleştirme algoritması
- Çoklu model desteği (örn: "S25-S24-S23 Ultra")
- Her varyanta doğru görselleri otomatik yükleyin

### 🛡️ Gelişmiş Hata Yönetimi
- **Retry Mekanizması**: Bağlantı hatalarında 3 kez otomatik yeniden deneme
- **Timeout Kontrolü**: 30 saniye üzeri işlemlerde otomatik durdurma
- **Büyük Dosya Kontrolü**: 10MB üzeri dosyalar atlanır
- **Boş Dosya Kontrolü**: 0 byte dosyalar otomatik filtrelenir
- Kullanıcı dostu hata mesajları

---

## 📋 Sistem Gereksinimleri

- **Tarayıcı**: Google Chrome 88+ veya Microsoft Edge 88+
- **İşletim Sistemi**: Windows 10/11, macOS, Linux
- **İkas Hesabı**: Aktif İkas e-ticaret paneli erişimi
- **Dosya Boyutu**: Görsel dosyaları maksimum 10MB

---

## 🚀 Kurulum

> 💡 **Detaylı kurulum için**: [KULLANIM_TALIMATLARI.md - Bölüm 1](KULLANIM_TALIMATLARI.md#1%EF%B8%8F⃣-ilk-kurulum)

### Adım 1: Dosyaları İndirin
```bash
# Git ile klonlayın
git clone https://github.com/veyselkilicerkan/kaff-ikas-otomasyon.git

# veya ZIP olarak indirin
# GitHub'dan "Code" → "Download ZIP"
```

### Adım 2: Chrome'a Yükleyin

1. **Chrome'u açın** ve adres çubuğuna şunu yazın:
   ```
   chrome://extensions
   ```

2. **Geliştirici Modunu** sağ üst köşeden açın
   
3. **"Paketlenmemiş öğe yükle"** butonuna tıklayın

4. İndirdiğiniz **klasörü seçin** (`kaff-ikas-otomasyon`)

5. ✅ Extension yüklendi! Sağ üst köşede KAFF logosunu göreceksiniz 🟡

### Adım 3: İlk Test (Önemli!)

1. İkas admin panelinize girin: `https://[mağazanız].ikas.com/admin`
2. **Ürünler** → Herhangi bir ürün seçin
3. **Varyantlar** sekmesine geçin
4. KAFF logosuna 🟡 tıklayın
5. Panel açılırsa **kurulum başarılı!** ✅

⚠️ **"Bağlantı hatası" alırsanız**: Sayfayı **F5** ile yenileyin ve tekrar deneyin

---

## 📖 Kullanım Kılavuzu

> 📚 **Daha detaylı anlatım için**: [KULLANIM_TALIMATLARI.md](KULLANIM_TALIMATLARI.md) dosyasındaki adım adım kılavuzu okuyun!

### 🔹 Fiyat Güncelleme

**Hızlı Özet:**
1. İkas panelinde **ürün varyant sayfasına** gidin (`/variants` URL'inde olmalı)
2. KAFF extension **logosuna tıklayın** 🟡
3. **"Fiyat Güncelleme"** bölümünde yeni fiyatı girin (örn: `1299`)
4. **"Tüm Fiyatları Güncelle"** butonuna tıklayın
5. ✅ Tüm varyantların fiyatları 2-5 saniyede güncellenir!

**💡 İpucu**: 
- Ondalıklı fiyatlar için nokta kullanın (örn: `1299.99`)
- Virgül veya binlik ayraç kullanmayın

---

### 🔹 Stok Güncelleme

**Hızlı Özet:**
1. İkas panelinde **ürün varyant sayfasına** gidin
2. KAFF extension'ı açın 🟡
3. **"Stok Güncelleme"** bölümünde yeni stok miktarını girin (örn: `10000`)
4. **"Tüm Stokları Güncelle"** butonuna tıklayın
5. ⚠️ Onay penceresinde **"Tamam"** deyin
6. ⏳ İşlem 30-60 saniye sürebilir (her varyant için popup açılır/kapanır)
7. ✅ Tüm varyantların stokları güncellenir!

**⚙️ Teknik Not**: 
- Stok güncelleme, İkas'ın popup mekanizmasını kullandığı için daha uzun sürer
- İşlem sırasında fareyi kullanmayın, başka yere tıklamayın
- **Stop butonu** ile dilediğiniz an durdurabilirsiniz

**📚 Detaylı anlatım**: [KULLANIM_TALIMATLARI.md - Stok Güncelleme](KULLANIM_TALIMATLARI.md#4%EF%B8%8F⃣-stok-güncelleme)

---

### 🔹 Görsel Yükleme (En Güçlü Özellik!)

> 📚 **Önemli**: Bu özellik için [KULLANIM_TALIMATLARI.md - Görsel Yükleme](KULLANIM_TALIMATLARI.md#5%EF%B8%8F⃣-görsel-yükleme-detaylı) bölümünü mutlaka okuyun! Klasör yapısı kritik öneme sahiptir.

#### Hızlı Özet

**1. Klasör Yapısını Hazırlayın:**

```
📁 Telefon Kılıfları/
├── 📁 1-17 Pro Max - Pro/
│   ├── 📷 foto1.jpg
│   ├── 📷 foto2.jpg
│   └── 📷 foto3.jpg
├── 📁 7-S25-S24-S23-S22 Ultra/
│   ├── 📷 foto1.jpg
│   ├── 📷 foto2.jpg
│   └── 📷 foto3.jpg
└── 📁 10-s22 - s22 Plus/
    ├── 📷 foto1.jpg
    └── 📷 foto2.jpg
```

**📌 Kritik Kurallar:**
- ✅ Her model için **ayrı klasör** oluşturun
- ✅ Klasör isimleri **varyant isimlerine benzer** olmalı (akıllı eşleştirme yapılır)
- ✅ Sadece **`.jpg` veya `.jpeg`** dosyaları kullanın
- ✅ Dosya boyutu **maksimum 10MB**

**2. Extension'da Yükleme:**
1. İkas varyant sayfasına gidin
2. KAFF extension'ı açın 🟡
3. **"Görsel Yükleme"** → **"Klasör Seç"** → Ana klasörü seçin
4. Durum kontrolü: "📁 12 klasör, 36 JPG hazır." mesajını görün
5. **"Tüm Görselleri Yükle"** butonuna tıklayın
6. ✅ Extension her varyanta uygun görselleri otomatik yükler! (1-3 dakika)

#### 🧠 Akıllı Eşleştirme Algoritması

Extension, klasör isimlerini varyant isimleriyle **token-based** (kelime bazlı) eşleştirir:

| Klasör İsmi | Eşleşen Varyantlar |
|-------------|-------------------|
| `7-S25-S24-S23-S22 Ultra` | ✅ Samsung S25 Ultra<br>✅ S24 Ultra<br>✅ S23 Ultra<br>✅ S22 Ultra |
| `1-17 Pro Max - Pro` | ✅ iPhone 17 Pro Max<br>✅ iPhone 17 Pro<br>❌ iPhone 17 (Pro yok) |
| `10-s22 - s22 Plus` | ✅ Samsung S22 Plus<br>✅ Samsung S22 |

**Avantajlar:**
- 🔤 Büyük/küçük harf duyarsız
- 🇹🇷 Türkçe karakter desteği (İ, ı, ş, ç, vb.)
- 🎯 Çoklu model desteği (1 klasör = 4 farklı model)
- 🧩 Harf/sayı kombinasyonları (S25, 17 Pro, vb.)

**📚 Detaylı örnekler**: [KULLANIM_TALIMATLARI.md - Akıllı Eşleştirme](KULLANIM_TALIMATLARI.md#-akıllı-eşleştirme-nasıl-çalışır)

---

## 🛠️ Sorun Giderme

> 📚 **Daha fazla çözüm**: [KULLANIM_TALIMATLARI.md - Sık Yapılan Hatalar](KULLANIM_TALIMATLARI.md#6%EF%B8%8F⃣-sık-yapılan-hatalar)

### ❌ "Bağlantı hatası! Lütfen sayfayı yenileyin (F5)"

**Sebep**: Content script henüz yüklenmemiş

**Hızlı Çözüm**:
1. **F5** tuşuna basın (sayfa yenilenir)
2. Extension'ı tekrar açın
3. ✅ Çalışmalı!

**Kalıcı Çözüm** (Tekrar olursa):
- `chrome://extensions` → KAFF → **🔄 Yenile** → İkas sayfasını F5 ile yenile

---

### ❌ "Varyant sayfasında değilsiniz!"

**Sebep**: Yanlış sayfadasınız

**Çözüm**:
- İkas → **Ürünler** → Ürün seçin → **"Varyantlar"** sekmesine gidin
- URL şuna benzemeli: `https://[mağaza].ikas.com/admin/products/*/variants`

---

### ⚠️ "İşlem zaman aşımına uğradı (30 saniye)"

**Sebep**: İnternet yavaş veya İkas sunucusu yanıt vermiyor

**Çözüm**:
1. İnternet bağlantınızı kontrol edin
2. Birkaç saniye bekleyip **tekrar deneyin**
3. Extension otomatik **3 kez retry** deneyecek

---

### ⚠️ "Dosya çok büyük, atlanıyor (12 MB)"

**Sebep**: Görsel dosyası 10MB'dan büyük

**Çözüm**:
1. Görseli bir editörde açın (Photoshop, Paint, vb.)
2. **Kaliteyi azaltarak** veya **boyutu küçülterek** kaydedin
3. Hedef: Her görsel < 10MB (önerilen: 500KB - 2MB)

**💡 Online Küçültme**: https://tinyjpg.com (ücretsiz, sürükle-bırak)

**📚 Detaylı anlatım**: [KULLANIM_TALIMATLARI.md - Büyük Görselleri Küçültme](KULLANIM_TALIMATLARI.md#adım-52-görselleri-hazırlayın)

---

### 🔍 Debug Modu (Gelişmiş)

Konsolda hata ayıklama:

1. İkas sayfasında **F12** → Console sekmesi

2. Klavyeden **Ctrl+Shift+K** basın

3. Debug panel çıkacak:
   ```
   🎯 ===== KAFF DEBUG PANEL =====
   Varyant sayısı: 26
   Sayfa: Varyant sayfası ✅
   ================================
   ```

4. Logları inceleyin:
   - 📤 Mesaj gönderiliyor
   - 📥 Cevap alındı
   - ❌ Hata varsa detayları gösterir

---

## 📊 Teknik Detaylar

### Mimari

```
┌─────────────┐
│  popup.js   │  ← Kullanıcı arayüzü (UI)
└──────┬──────┘
       │ chrome.tabs.sendMessage
       ▼
┌─────────────┐
│ content.js  │  ← Orkestratör (koordinatör)
└──────┬──────┘
       │
       ├─► modules/domFinder.js    (DOM seçici)
       ├─► modules/reactHelper.js  (React state fixer)
       └─► FOLDER_VARIANT_MAPPING  (eşleştirme tablosu)
```

### Kullanılan Teknolojiler

- **Manifest V3**: Chrome Extension yeni standardı
- **FileReader API**: Dosya okuma (Base64 encoding)
- **DataTransfer API**: Drag-drop simülasyonu
- **React Event System**: Synthetic event handling
- **MutationObserver**: DOM değişiklik takibi
- **Promise.race**: Timeout kontrolü
- **Retry Pattern**: Hata yönetimi

### Güvenlik

- ✅ Sadece `ikas.com` ve `mykias.com` domainlerinde çalışır
- ✅ Kullanıcı onayı olmadan dosya yüklemez
- ✅ Hassas veri kaydedilmez (localStorage kullanılmaz)
- ✅ XSS korumalı (input sanitization)

---

## 📂 Proje Yapısı

```
kaff-ikas-otomasyon/
├── manifest.json              # Extension yapılandırması
├── popup.html                 # Kullanıcı arayüzü
├── popup.js                   # UI mantığı ve dosya işleme
├── content.js                 # Ana orkestratör
├── modules/
│   ├── domFinder.js          # DOM element bulucu
│   └── reactHelper.js        # React state yönetimi
├── assets/icons/             # Logo dosyaları
│   ├── kaff-16.png
│   ├── kaff-32.png
│   ├── kaff-48.png
│   └── kaff-128.png
├── PRD.md                    # Ürün gereksinimleri
├── TASKS.md                  # Geliştirme yol haritası
├── DOM_ANALYSIS.md           # İkas DOM analizi
└── README.md                 # Bu dosya
```

---

## 🔄 Versiyon Geçmişi

### v2.0.0 (18 Şubat 2026) - Nur Teması & Performans 🆕
- ✨ **Nur Teması**: Özel altın/yeşil renk paleti
- 🎨 Klasik serif fontlar (Cormorant Garamond)
- 📜 Said Nursi alıntısı footer'da
- 🌙 "İman Teması" dark mode
- ⚡ Performans optimizasyonu (2x daha hızlı)
  - Popup bekleme süresi: 500ms → 150ms
  - Popup kapanış kontrolü: 200ms → 20ms aralıklar
  - Toplam timeout: 15s → 5s
  - Kapanış sonrası bekleme: 300ms → 0ms
- 🛑 Stop butonu - işlemi durdurma özelliği
- 🔗 LinkedIn bağlantısı footer'da

### v1.1.0 (15 Şubat 2026) - Edge Case Güncellemesi
- ✅ Büyük dosya kontrolü (>10MB)
- ✅ Retry mekanizması (3 deneme)
- ✅ Network timeout kontrolü (30s)
- ✅ Boş dosya kontrolü
- ✅ İyileştirilmiş hata mesajları
- ✅ UI iyileştirmeleri (logo, footer)

### v1.0.10 (14 Şubat 2026)
- ✅ Görsel yükleme beyaz ekran sorunu çözüldü
- ✅ FileReader.readAsDataURL() implementasyonu
- ✅ Base64 transfer optimizasyonu

### v1.0.9 (13 Şubat 2026)
- ✅ Hardcoded FOLDER_VARIANT_MAPPING
- ✅ Token-based eşleştirme algoritması
- ✅ Çoklu model desteği

### v1.0.0 (10 Şubat 2026)
- 🎉 İlk stabil release
- ✅ Fiyat güncelleme
- ✅ Stok güncelleme
- ✅ Görsel yükleme

---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. Repo'yu **fork** edin
2. Feature branch oluşturun: `git checkout -b feature/yeni-ozellik`
3. Değişikliklerinizi commit edin: `git commit -m 'feat: Yeni özellik eklendi'`
4. Branch'i push edin: `git push origin feature/yeni-ozellik`
5. **Pull Request** açın

---

## 📞 İletişim & Destek

### 🐛 Hata Bildirimi

**GitHub Issues** (Önerilen):
1. https://github.com/veyselkilicerkan/kaff-ikas-otomasyon/issues
2. **[New Issue]** → Sorununuzu detaylı anlatın
3. Ekran görüntüsü ekleyin

**E-posta**: veysel@example.com  
Konu: `[KAFF Extension] - [Sorun Özeti]`

### 💬 Genel Sorular

**Önce Bakın**:
- 📚 [KULLANIM_TALIMATLARI.md](KULLANIM_TALIMATLARI.md) - Detaylı kılavuz
- 🛠️ [Sorun Giderme](#️-sorun-giderme) - Yaygın hatalar
- 📄 [PRD.md](PRD.md) - Teknik detaylar

### 📬 İletişim

**Geliştirici**: Veysel Kılıçerkan  
**E-posta**: veysel@example.com  
**GitHub**: [@veyselkilicerkan](https://github.com/veyselkilicerkan)  
**LinkedIn**: [Veysel Kılıçerkan](https://www.linkedin.com/in/veyselkilicerkan)

**Müşteri**: KAFF Telefon Aksesuarları  
**Web**: [www.kaff.com.tr](https://www.kaff.com.tr)

---

## � Ek Kaynaklar

### 📖 Proje Dokümantasyonu
- **[KULLANIM_TALIMATLARI.md](KULLANIM_TALIMATLARI.md)** - 🆕 Adım adım detaylı kılavuz (Yeni kullanıcılar için!)
- **[PRD.md](PRD.md)** - Ürün gereksinimleri ve teknik mimari
- **[TASKS.md](TASKS.md)** - Geliştirme yol haritası ve tamamlanan görevler
- **[DOM_ANALYSIS.md](DOM_ANALYSIS.md)** - İkas DOM yapısı detaylı analizi

### 🌐 Harici Kaynaklar
- **İkas Destek**: https://support.ikas.com/tr/
- **Chrome Extension API**: https://developer.chrome.com/docs/extensions/
- **TinyJPG**: https://tinyjpg.com (Görsel küçültme)
- **React Event System**: https://react.dev/learn/responding-to-events

### 🎓 Öğrenim Kaynakları (Geliştiriciler için)
- **Manifest V3 Geçiş Kılavuzu**: https://developer.chrome.com/docs/extensions/mv3/intro/
- **React Synthetic Events**: https://react.dev/reference/react-dom/components/common#react-event-object
- **FileReader API**: https://developer.mozilla.org/en-US/docs/Web/API/FileReader

---

## 🙏 Teşekkürler

- **İkas Platformu**: Güçlü e-ticaret altyapısı
- **Chrome Extension Docs**: Detaylı dokümantasyon
- **KAFF Ekibi**: Geri bildirim ve test desteği

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır.

Copyright © 2026 Veysel Kılıçerkan

İzin verilir: Kullanma, kopyalama, değiştirme, birleştirme, yayınlama, dağıtma, alt lisanslama ve/veya yazılımın kopyalarını satma.

Tek koşul: Yukarıdaki telif hakkı bildirimi tüm kopyalarda yer almalıdır.

---

## ❓ Sık Sorulan Sorular (FAQ)

### 1️⃣ Extension güvenli mi? Verilerim çalınır mı?

**Cevap**: Evet, %100 güvenli!
- ✅ Sadece `ikas.com` ve `mykias.com` domainlerinde çalışır
- ✅ Hiçbir veri dışarı gönderilmez
- ✅ localStorage/cookie kullanılmaz
- ✅ Açık kaynak kodludur, inceleyebilirsiniz

---

### 2️⃣ Hangi tarayıcılarda çalışır?

**Cevap**:
- ✅ Google Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Brave (Chromium tabanlı)
- ❌ Firefox (farklı extension standardı kullanır)
- ❌ Safari (farklı extension standardı kullanır)

---

### 3️⃣ Fiyat güncellemesi yapınca İkas'a anında yansıyor mu?

**Cevap**: Evet! Extension, React state'ini doğrudan günceller. Değişiklikler 2-5 saniye içinde İkas veritabanına kaydedilir.

---

### 4️⃣ 100+ varyantım var, hepsini yükleyebilir miyim?

**Cevap**: Evet! Ancak:
- ⏱️ **Fiyat**: 100 varyant ≈ 5-10 saniye
- ⏱️ **Stok**: 100 varyant ≈ 3-4 dakika (popup açma/kapama nedeniyle)
- ⏱️ **Görsel**: 100 varyant × 4 görsel ≈ 8-10 dakika

---

### 5️⃣ Görselleri PNG formatında yükleyebilir miyim?

**Cevap**: Hayır, sadece **JPG/JPEG** desteklenir. PNG'yi JPG'ye çevirin:
- Windows: Paint → Aç → Farklı Kaydet → JPEG
- Online: https://png2jpg.com

---

### 6️⃣ Extension ücretsiz mi?

**Cevap**: Evet, **tamamen ücretsiz!** MIT lisanslıdır. İsterseniz kendi projenizde kullanabilirsiniz.

---

### 7️⃣ İkas dışında başka platformlarda çalışır mı?

**Cevap**: Hayır, sadece **İkas** için özel geliştirilmiştir. Diğer platformlar (Shopify, Ticimax, vb.) farklı DOM yapısına sahiptir.

---

### 8️⃣ Varyant başına kaç görsel yükleyebilirim?

**Cevap**: Sınır yok! Klasördeki tüm JPG dosyalarını yükler. Ancak:
- ⚠️ İkas'ın kendi limiti: ~20-30 görsel/varyant (platform sınırı)
- 💡 Önerilen: 3-5 görsel/varyant (hız optimizasyonu)

---

### 9️⃣ Extension kullanırken başka sekmede çalışabilir miyim?

**Cevap**:
- ✅ **Fiyat güncelleme**: Evet, arka planda çalışır
- ❌ **Stok/Görsel yükleme**: Hayır, aktif sekmede kalmalısınız (popup açma nedeniyle)

---

### 🔟 Mobil cihazda (telefon/tablet) kullanabilir miyim?

**Cevap**: Hayır, Chrome extension'ları sadece **masaüstü** tarayıcılarda çalışır.

---

## ✅ Hızlı Başlangıç Kontrol Listesi

Yeni kullanıcılar için adım adım kontrol listesi:

### Kurulum Aşaması
- [ ] Extension dosyalarını indirdim
- [ ] Chrome'a başarıyla yükledim
- [ ] Extension ikonu sağ üstte görünüyor 🟡
- [ ] İkas varyant sayfasında extension açılıyor

### İlk Test (Test Ürünüyle Yapın!)
- [ ] Test ürünü oluşturdum (3-5 varyant)
- [ ] Fiyat güncelleme başarılı ✅
- [ ] Stok güncelleme başarılı ✅
- [ ] Görsel klasör yapısını hazırladım
- [ ] Görsel yükleme başarılı ✅

### Gerçek Kullanım
- [ ] [KULLANIM_TALIMATLARI.md](KULLANIM_TALIMATLARI.md) dosyasını okudum
- [ ] Gerçek ürünlerde fiyat güncelleme yaptım
- [ ] Gerçek ürünlerde stok güncelleme yaptım
- [ ] Gerçek ürünlerde görsel yükleme yaptım
- [ ] Hata mesajlarını nasıl çözeceğimi öğrendim

✅ **Tamamladınız mı? Artık uzman kullanıcısınız!** 🎉

---

## 🚀 Gelecek Özellikler (Roadmap)

Planlanan geliştirmeler:

- 🔄 **Toplu İndirim Uygulama** (%)
- 📊 **Excel İçe/Dışa Aktarma**
- 🎨 **PNG Görsel Desteği**
- 🌍 **Çoklu Dil Desteği** (İngilizce, Almanca)
- 📱 **Mobil Uyumlu Versiyon** (Progressive Web App)
- 🔔 **Bildirim Sistemi** (İşlem tamamlandı bildirimleri)
- 📝 **Varyant Açıklama Güncelleme**

💡 **Öneriniz var mı?** → [GitHub Issues](https://github.com/veyselkilicerkan/kaff-ikas-otomasyon/issues) açın!

---

## 📚 Ek Kaynaklar

- **İkas Platformu**: Güçlü e-ticaret altyapısı
- **Chrome Extension Docs**: Detaylı dokümantasyon
- **KAFF Ekibi**: Geri bildirim ve test desteği

---

## ⭐ Beğendiniz mi?

Bu extension işinize yaradıysa:
- ⭐ GitHub'da **yıldız verin** (Star)
- 🐦 Sosyal medyada **paylaşın**
- 💬 Geri bildirimlerinizi **GitHub Issues**'da paylaşın
- 🤝 Projeye **katkıda bulunun** (Pull Request)

---

**🚀 Mutlu e-ticaret yönetimi!**

*"Manuel işleri otomasyona çevirerek, değer yaratan işlere odaklanın."*

---

<div align="center">
  <img src="assets/icons/kaff-128.png" alt="KAFF Logo" width="80">
  
  ### KAFF İkas Otomasyonu v2.0.0
  
  *Modern E-ticaret Yönetimi - Hızlı, Güvenilir, Açık Kaynak*
  
  Made with ❤️ by [Veysel Kılıçerkan](https://github.com/veyselkilicerkan)
  
  © 2026 - MIT Lisansı
  
  ---
  
  [🐛 Hata Bildir](https://github.com/veyselkilicerkan/kaff-ikas-otomasyon/issues) •
  [🤝 Katkıda Bulun](https://github.com/veyselkilicerkan/kaff-ikas-otomasyon/pulls) •
  [📚 Detaylı Kılavuz](KULLANIM_TALIMATLARI.md) •
  [🌐 KAFF](https://www.kaff.com.tr)
  
  ⭐ **Star vererek projeyi destekleyin!** ⭐
  
</div>

