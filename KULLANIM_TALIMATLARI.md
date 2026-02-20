# 📚 KAFF İkas Otomasyonu - Detaylı Kullanım Talimatları

> **Hedef Kitle**: Teknik bilgisi olmayan kullanıcılar için adım adım rehber

---

## 📑 İçindekiler

1. [İlk Kurulum](#1-ilk-kurulum)
2. [Extension'ı Açma](#2-extensionı-açma)
3. [Fiyat Güncelleme](#3-fiyat-güncelleme)
4. [Stok Güncelleme](#4-stok-güncelleme)
5. [Görsel Yükleme (Detaylı)](#5-görsel-yükleme-detaylı)
6. [Sık Yapılan Hatalar](#6-sık-yapılan-hatalar)
7. [İpuçları ve Püf Noktalar](#7-ipuçları-ve-püf-noktalar)
8. [Video Eğitimler](#8-video-eğitimler)

---

## 1️⃣ İlk Kurulum

### Adım 1.1: Dosyaları İndirin

**Seçenek A - GitHub'dan ZIP İndirme (Önerilen - Kolay)**

1. Tarayıcınızda şu adresi açın: `https://github.com/veyselkilicerkan/kaff-ikas-otomasyon`
2. Yeşil **"Code"** butonuna tıklayın
3. **"Download ZIP"** seçeneğini seçin
4. İndirilen `kaff-ikas-otomasyon-main.zip` dosyasını masaüstünüze kaydedin
5. ZIP dosyasına **sağ tıklayın** → **"Tümünü Ayıkla"** veya **"Extract All"**
6. Masaüstünüzde `kaff-ikas-otomasyon-main` klasörü oluşacak

**Seçenek B - Git ile Klonlama (Gelişmiş)**

```bash
# Komut satırını açın (CMD veya PowerShell)
cd Desktop
git clone https://github.com/veyselkilicerkan/kaff-ikas-otomasyon.git
```

---

### Adım 1.2: Chrome Extension Yükleme

1. **Google Chrome** tarayıcınızı açın

2. Adres çubuğuna şunu yazın ve Enter'a basın:
   ```
   chrome://extensions
   ```
   *(Kopyala → Yapıştır yapabilirsiniz)*

3. Sağ üst köşede **"Geliştirici modu"** yazısını görün
   - ⚠️ Kapalıysa → **Mavi düğmeyi sağa kaydırarak açın**
   - ✅ Açıksa → Devam edin

4. Sol üstte **3 buton** görünecek:
   - ☑ "Paketlenmemiş öğe yükle" butonuna **tıklayın**

5. Açılan dosya gezgininde:
   - **Masaüstü**'nü seçin
   - **`kaff-ikas-otomasyon-main`** klasörünü seçin
   - **"Klasör seç"** veya **"Select Folder"** butonuna tıklayın

6. ✅ **Başarılı!** Extension yüklenecek ve şöyle görünecek:
   ```
   ┌──────────────────────────────────────┐
   │ 🟡 KAFF İkas Otomasyonu              │
   │ v2.0.0                               │
   │ ID: abcd1234efgh...                  │
   │ ◎ Uzantı simgelerinde göster: ☑      │
   └──────────────────────────────────────┘
   ```

7. Chrome'un **sağ üst köşesinde** KAFF logosunu göreceksiniz 🟡

---

### Adım 1.3: İlk Test

1. İkas admin panelinize girin: `https://[mağazanız].ikas.com/admin`
2. **Ürünler** menüsüne tıklayın
3. Herhangi bir ürün seçin
4. **Varyantlar** sekmesine geçin
5. KAFF logosuna tıklayın
6. Panel açılırsa **kurulum başarılı!** ✅

---

## 2️⃣ Extension'ı Açma

### Yöntem 1: Logo ile Açma (Önerilen)

1. Chrome'un **sağ üst köşesinde** KAFF logosunu bulun 🟡
2. Logoya **tıklayın**
3. Açılan panel:
   ```
   ┌───────────────────────────────┐
   │  KAFF İKAS OTOMASYONU         │
   │  ───────────────────────────  │
   │  💰 Fiyat Güncelleme          │
   │  📦 Stok Güncelleme           │
   │  🖼️ Görsel Yükleme            │
   └───────────────────────────────┘
   ```

### Yöntem 2: Klavye Kısayolu ile Açma

**Windows/Linux:**
```
Ctrl + Shift + E
```

**macOS:**
```
Cmd + Shift + E
```

⚠️ **Not**: Kısayol çalışmıyorsa:
- `chrome://extensions/shortcuts` adresine gidin
- KAFF için kısayol tanımlayın

---

## 3️⃣ Fiyat Güncelleme

### Senaryo: Tüm varyantların fiyatını 1.299 TL yapmak istiyorsunuz

#### Adım 3.1: Doğru Sayfaya Gidin

1. İkas Admin Panel → **Ürünler**
2. Fiyat güncelleyeceğiniz ürünü seçin (örn: "iPhone 15 Kılıfı")
3. **Varyantlar** sekmesine tıklayın
4. URL şuna benzemeli:
   ```
   https://kaff.ikas.com/admin/products/12345/variants
   ```
   🔍 URL'de `/variants` olmalı!

#### Adım 3.2: Extension'ı Açın

- Chrome **sağ üst köşe** → KAFF logosu 🟡 → Tıklayın

#### Adım 3.3: Fiyat Girin

1. **"💰 Fiyat Güncelleme"** bölümünü bulun
2. Metin kutusuna **`1299`** yazın
   - ⚠️ **Virgül/Nokta Kullanmayın** (Tam sayı şeklinde)
   - ✅ Doğru: `1299`
   - ❌ Yanlış: `1.299`, `1,299 TL`, `1299.00`

#### Adım 3.4: Güncelleme Başlatın

1. **"Tüm Fiyatları Güncelle"** butonuna tıklayın
2. ⏳ 2-5 saniye bekleyin
3. ✅ Başarı mesajı: **"Tüm fiyatlar güncellendi!"**

#### Adım 3.5: Kontrol Edin

- Sayfa **otomatik yenilenecek** (F5 gibi)
- Varyant listesinde tüm fiyatları kontrol edin
- Hepsi **1.299,00 TL** olmalı

### 💡 Fiyat Güncelleme İpuçları

| Girdi | Sonuç | Açıklama |
|-------|-------|----------|
| `1299` | 1.299,00 TL | ✅ Tam sayı önerilen |
| `1299.99` | 1.299,99 TL | ✅ Ondalık nokta ile |
| `1299,99` | ❌ Hata | Virgül kullanmayın |
| `1.299` | 1,30 TL | ❌ Nokta binlik ayracı değil |

---

## 4️⃣ Stok Güncelleme

### Senaryo: Tüm varyantların stokunu 10.000 yapmak istiyorsunuz

#### Adım 4.1: Doğru Sayfaya Gidin

- Fiyat güncellemedeki gibi → `/variants` sayfasında olun

#### Adım 4.2: Extension'ı Açın

- KAFF logosu 🟡 → Tıkla

#### Adım 4.3: Stok Miktarı Girin

1. **"📦 Stok Güncelleme"** bölümünü bulun
2. Metin kutusuna **`10000`** yazın
   - ✅ Sadece rakam
   - ❌ Nokta/virgül kullanmayın

#### Adım 4.4: Güncelleme Başlatın

1. **"Tüm Stokları Güncelle"** butonuna tıklayın
2. ⚠️ Onay penceresi çıkacak:
   ```
   ┌────────────────────────────────────┐
   │ Bu işlem tüm varyantların stokunu  │
   │ güncelleyecek. Emin misiniz?       │
   │                                    │
   │   [İptal]         [Tamam]          │
   └────────────────────────────────────┘
   ```
3. **"Tamam"** butonuna tıklayın

#### Adım 4.5: İşlem Devam Ediyor

⏳ **Önemli**: Stok güncelleme birkaç dakika sürebilir!

- Extension her varyant için:
  1. Düzenle popup'ını açar
  2. Stok alanını doldurur
  3. Kaydeder
  4. Popup'ı kapatır
  5. Bir sonraki varyanta geçer

**Gözleminiz:**
- Ekranda popup'lar açılıp kapanacak (normal!)
- 26 varyant × 2 saniye ≈ **52 saniye** sürer

#### Adım 4.6: Tamamlandı

✅ Başarı mesajı: **"Tüm stoklar güncellendi!"**

### ⚠️ Stok Güncelleme Önemli Notlar

- 🖱️ **İşlem sırasında fareyi kullanmayın!** (Popup'lara tıklarsanız hata olabilir)
- 🌐 **İnternet bağlantısı stabil olmalı**
- ⏱️ **Her varyant için ~2 saniye** (30 varyant = 1 dakika)
- 🛑 **Stop butonu** ile dilediğiniz an durdurabilirsiniz

---

## 5️⃣ Görsel Yükleme (Detaylı)

### Senaryo: 26 farklı telefon modeli için her birine 3-5 görsel yükleyeceksiniz

---

### Adım 5.1: Klasör Yapısı Hazırlayın

#### Örnek Klasör Ağacı (Masaüstünüzde)

```
📁 C:\Users\Kullanıcı\Desktop\Telefon Kılıfları\
│
├── 📁 1-17 Pro Max - Pro\
│   ├── 📷 foto1.jpg      (800 KB)
│   ├── 📷 foto2.jpg      (750 KB)
│   ├── 📷 foto3.jpg      (900 KB)
│   └── 📷 foto4.jpeg     (850 KB)
│
├── 📁 2-16 Pro Max - Pro\
│   ├── 📷 resim1.jpg
│   ├── 📷 resim2.jpg
│   └── 📷 resim3.jpg
│
├── 📁 7-S25-S24-S23-S22 Ultra\
│   ├── 📷 samsung1.jpg
│   ├── 📷 samsung2.jpg
│   ├── 📷 samsung3.jpg
│   └── 📷 samsung4.jpg
│
├── 📁 10-s22 - s22 Plus\
│   ├── 📷 foto1.jpg
│   └── 📷 foto2.jpg
│
└── ... (diğer klasörler)
```

#### 📋 Klasör İsimlendirme Kuralları

| ✅ Doğru | ❌ Yanlış | Açıklama |
|---------|----------|----------|
| `1-17 Pro Max - Pro` | `iPhone 17 Pro Max` | Kısa ve öz |
| `7-S25-S24-S23-S22 Ultra` | `Samsung S25 Ultra - S24 Ultra - S23 Ultra` | Tire ayracı kullanın |
| `10-s22 - s22 Plus` | `S22 ve S22 Plus` | "ve" değil "-" kullanın |

**💡 Püf Noktası**: Klasör ismi, varyant isminin **anahtar kelimelerini** içermeli:
- Varyant: "iPhone 17 Pro Max Kırmızı"
- Klasör: "1-17 Pro Max" ✅

---

### Adım 5.2: Görselleri Hazırlayın

#### Desteklenen Formatlar
- ✅ `.jpg` veya `.jpeg`
- ❌ `.png`, `.webp`, `.gif` (desteklenmez)

#### Dosya Boyutu Kontrolleri
1. Windows Dosya Gezgini'nde klasöre gidin
2. Görsele **sağ tıklayın** → **Özellikler**
3. "Boyut" alanına bakın:
   - ✅ **2.5 MB** → Uygun
   - ⚠️ **12 MB** → Çok büyük, küçültün!

#### Büyük Görselleri Küçültme (Ücretsiz Yöntem)

**Windows 10/11 Fotoğraflar Uygulaması ile:**

1. Görsele çift tıklayın (Fotoğraflar uygulamasında açılır)
2. Sağ üst → **"..." (Üç nokta)** → **"Yeniden Boyutlandır"**
3. Boyut seçin:
   - **Küçük (640px)** → ~200 KB
   - **Orta (1024px)** → ~500 KB
   - **Büyük (1920px)** → ~2 MB
4. **"Boyutlandırılmış kopyayı kaydet"** → Klasöre kaydedin

**Online Araç (İnternetsiz çalışanlar için):**
- https://tinyjpg.com (sürükle-bırak, otomatik küçültür)

---

### Adım 5.3: İkas'ta Varyant Sayfasına Gidin

1. İkas Admin Panel
2. Ürünler → Ürününüzü seçin
3. **Varyantlar** sekmesi
4. URL: `https://kaff.ikas.com/admin/products/12345/variants`

---

### Adım 5.4: Extension'da Klasör Seçin

1. KAFF extension'ı açın (logo 🟡)
2. **"🖼️ Görsel Yükleme"** bölümüne kaydırın
3. **"Klasör Seç"** butonuna tıklayın
4. Açılan dosya gezgininde:
   - **"Telefon Kılıfları"** ana klasörünü seçin
   - ⚠️ **Alt klasörlerden birini değil, ANA KLASÖRÜ seçin!**
5. **"Klasör seç"** butonuna tıklayın

---

### Adım 5.5: Durum Kontrolü

Extension, klasörleri tarayıp size bilgi verir:

```
┌────────────────────────────────────┐
│ ✅ Klasör seçildi!                 │
│ 📁 12 klasör, 36 JPG hazır.        │
└────────────────────────────────────┘
```

**Anlamı:**
- **12 klasör**: "Telefon Kılıfları" içinde 12 alt klasör var
- **36 JPG**: Toplam 36 adet .jpg/.jpeg dosyası bulundu

⚠️ **Eğer "0 JPG" görüyorsanız:**
- Alt klasörlerde JPG dosyası yok demektir
- Klasör yapınızı kontrol edin

---

### Adım 5.6: Yükleme Başlatın

1. **"Tüm Görselleri Yükle"** büyük butonuna tıklayın
2. ⚠️ Onay penceresi:
   ```
   Bu işlem her varyanta uygun görselleri yükleyecek.
   İşlem uzun sürebilir. Devam edilsin mi?
   ```
3. **"Tamam"** deyin

---

### Adım 5.7: İşlem Devam Ediyor

⏳ **Sabırla Bekleyin!** (1-3 dakika sürebilir)

**Console'da (F12) göreceğiniz loglar:**

```
🎯 ===== KAFF DEBUG PANEL =====
Varyant sayısı: 26
================================

📂 Klasör seçildi: 12 klasör, 36 JPG

🔍 Varyant: iPhone 17 Pro Max
   → Klasör eşleşti: "1-17 Pro Max - Pro"
   → 4 dosya yükleniyor...
   ✅ Tamamlandı (5.2 saniye)

🔍 Varyant: Samsung S25 Ultra
   → Klasör eşleşti: "7-S25-S24-S23-S22 Ultra"
   → 4 dosya yükleniyor...
   ✅ Tamamlandı (4.8 saniye)

... (devam eder)

✅ Tüm görseller yüklendi! (26/26 varyant)
```

**Gözleminiz:**
- Her varyant için popup açılır-kapanır
- Görseller otomatik sürüklenip bırakılır

---

### Adım 5.8: Tamamlandı!

✅ Başarı mesajı: **"Tüm görseller yüklendi!"**

**Kontrol Edin:**
1. Varyantlara tek tek tıklayın
2. Görsel galerisi dolmuş olmalı
3. Her varyantın kendine özel görselleri var mı?

---

### 🧠 Akıllı Eşleştirme Nasıl Çalışır?

Extension, klasör ismini **kelimelere böler** ve varyant ismiyle **eşleştirir**.

#### Örnek 1: Çoklu Model Eşleştirme

```
Klasör: "7-S25-S24-S23-S22 Ultra"

Eşleşen Varyantlar:
✅ "Samsung S25 Ultra Kırmızı"      (S25 + Ultra eşleşti)
✅ "Samsung S24 Ultra Mavi"         (S24 + Ultra eşleşti)
✅ "Samsung S23 Ultra Siyah"        (S23 + Ultra eşleşti)
✅ "Samsung S22 Ultra Beyaz"        (S22 + Ultra eşleşti)
❌ "Samsung S25 Plus"               (Ultra yok)
```

#### Örnek 2: Kısmi Eşleştirme

```
Klasör: "1-17 Pro Max - Pro"

Eşleşen Varyantlar:
✅ "iPhone 17 Pro Max Gold"         (17 + Pro + Max eşleşti)
✅ "iPhone 17 Pro Silver"           (17 + Pro eşleşti)
❌ "iPhone 17 Standart"             (Pro yok)
```

#### Örnek 3: Türkçe Karakter Desteği

```
Klasör: "5-İphone 15 Pro"

Eşleşen Varyantlar:
✅ "İphone 15 Pro Yeşil"            (Büyük/küçük harf duyarsız)
✅ "iPhone 15 Pro Max"
```

---

### ⚠️ Görsel Yükleme Sık Hatalar

#### Hata 1: "Eşleşen klasör bulunamadı"

**Neden**: Klasör ismi varyant ismiyle uyuşmuyor

**Çözüm:**
1. Varyant ismini kopyalayın: `Samsung S25 Ultra Kırmızı`
2. Anahtar kelimeleri bulun: `S25`, `Ultra`
3. Klasör ismini şöyle yapın: `7-S25 Ultra`

---

#### Hata 2: "0 JPG hazır"

**Neden**: Alt klasörlerde JPG dosyası yok

**Çözüm:**
1. Ana klasöre gidin
2. Alt klasörleri açın
3. İçlerinde `.jpg` veya `.jpeg` dosyası var mı kontrol edin
4. Varsa farklı klasör seçmiş olabilirsiniz

---

#### Hata 3: "Dosya çok büyük, atlanıyor (12.5 MB)"

**Neden**: 10MB'dan büyük dosyalar yüklenmez

**Çözüm:**
- [Adım 5.2](#adım-52-görselleri-hazırlayın)'deki küçültme yöntemini kullanın

---

#### Hata 4: "İşlem zaman aşımına uğradı"

**Neden**: İnternet yavaş veya İkas sunucusu yanıt vermiyor

**Çözüm:**
1. İnternet hızınızı kontrol edin
2. Birkaç varyant değil, tek tek manuel yüklemeyi deneyin
3. Extension otomatik 3 kez retry yapar, bekleyin

---

## 6️⃣ Sık Yapılan Hatalar

### ❌ Hata 1: "Bağlantı hatası! Sayfayı yenileyin (F5)"

**Ne zaman olur**: Extension'ı açtığınızda

**Neden**: Content script henüz yüklenmemiş

**Çözüm (Kolay):**
1. Klavyeden **F5** tuşuna basın (sayfa yenilenir)
2. Extension'ı tekrar açın
3. ✅ Çalışması gerekir

**Çözüm (Kalıcı):**
1. `chrome://extensions` adresine gidin
2. KAFF extension'ı bulun
3. **🔄 (Yenile simgesi)** ikonuna tıklayın
4. İkas sayfasını F5 ile yenileyin

---

### ❌ Hata 2: "Varyant sayfasında değilsiniz!"

**Ne zaman olur**: Extension'ı yanlış sayfada açtığınızda

**Neden**: İkas'ta `/variants` URL'sinde değilsiniz

**Çözüm:**
1. İkas Admin Panel → **Ürünler**
2. Bir ürün seçin
3. **"Varyantlar"** sekmesine tıklayın
4. URL şuna benzemeli:
   ```
   https://kaff.ikas.com/admin/products/12345/variants
   ```
5. ✅ Artık extension açılır

---

### ❌ Hata 3: Fiyat güncellendi ama sayfa yenilenmiyor

**Neden**: Tarayıcı cache sorunu

**Çözüm:**
- **Ctrl + F5** (Hard refresh)
- veya manuel **F5** basın

---

### ❌ Hata 4: Stok güncelleme ortada dondu kaldı

**Neden**: Popup'lardan birine tıkladınız veya başka sekmeye geçtiniz

**Çözüm:**
1. **Stop butonu**'na basın (v2.0.0+)
2. Sayfayı **F5** ile yenileyin
3. İşlemi tekrar başlatın
4. ⚠️ Bu sefer **hiçbir yere tıklamayın!**

---

### ❌ Hata 5: Görseller yüklendi ama beyaz görünüyor

**Neden**: Eski extension versiyonu (v1.0.9 öncesi)

**Çözüm:**
1. `chrome://extensions` → KAFF
2. Versiyon kontrol edin: **v2.0.0** veya üzeri olmalı
3. Değilse → GitHub'dan son versiyonu indirin
4. Extension'ı silip yeniden yükleyin

---

## 7️⃣ İpuçları ve Püf Noktalar

### 💡 İpucu 1: Görsel Yükleme Hızlandırma

**Strateji**: Klasör isimlerini basit tutun

❌ **Yavaş:**
```
📁 iPhone-17-Pro-Max-Kirmizi-Krem-Mavi-Modelleri
```

✅ **Hızlı:**
```
📁 1-17 Pro Max
```

**Neden**: Daha az karakter = Daha hızlı eşleştirme

---

### 💡 İpucu 2: Stok Güncelleme Sırasında Ne Yapayım?

**Cevap**: Hiçbir şey! 😄

- 🚫 Fareyi hareket ettirmeyin
- 🚫 Başka sekmeye geçmeyin
- 🚫 Popup'lara tıklamayın
- ✅ Sadece bekleyin (30-60 saniye)

**Bonus**: YouTube videosu açıp izleyebilirsiniz (başka monitörde/telefonda)

---

### 💡 İpucu 3: Fiyat Güncellemede Yüzde İndirim

**Senaryo**: Tüm fiyatları %20 indirmek istiyorsunuz

**Çözüm**:
1. Mevcut fiyat: 1.500 TL
2. %20 indirim: 1.500 × 0.80 = **1.200 TL**
3. Extension'a `1200` girin
4. Güncelle!

**Excel ile Toplu Hesaplama:**
```
= (Eski Fiyat) * 0.80
```

---

### 💡 İpucu 4: Test Ürünü Oluşturun

**Önerim**: İlk kullanımda test ürünü ile deneyin

1. İkas'ta **yeni bir test ürünü** oluşturun
2. 3-5 varyant ekleyin
3. Extension'ı bu üründe **test edin**
4. Sorunsuz çalışınca → Gerçek ürünlere geçin

---

### 💡 İpucu 5: Görsel Yedekleme

**Önemli**: Görselleri yüklemeden önce yedekleyin!

1. Ana görsel klasörünü kopyalayın
2. `Telefon Kılıfları - Yedek` olarak kaydedin
3. Sorun olursa geri yükleyin

---

## 8️⃣ Video Eğitimler

### 📹 Temel Kullanım Videoları (Önerilen Sıra)

#### Video 1: Kurulum (5 dakika)
**İçerik:**
- GitHub'dan indirme
- Chrome'a yükleme
- İlk açılış kontrolü

**YouTube Linki**: *[Yakında hazırlanacak]*

---

#### Video 2: Fiyat Güncelleme (3 dakika)
**İçerik:**
- Varyant sayfasına gitme
- Fiyat girme ve güncelleme
- Kontrol etme

**YouTube Linki**: *[Yakında hazırlanacak]*

---

#### Video 3: Stok Güncelleme (4 dakika)
**İçerik:**
- Stok güncelleme süreci
- Popup'ların açılıp kapanması
- Tamamlanma kontrolü

**YouTube Linki**: *[Yakında hazırlanacak]*

---

#### Video 4: Görsel Yükleme - Klasör Hazırlama (8 dakika)
**İçerik:**
- Klasör yapısı oluşturma
- Görselleri organize etme
- İsimlendirme kuralları

**YouTube Linki**: *[Yakında hazırlanacak]*

---

#### Video 5: Görsel Yükleme - Extension Kullanımı (10 dakika)
**İçerik:**
- Klasör seçme
- Eşleştirme kontrolü
- Yükleme süreci
- Hata çözümü

**YouTube Linki**: *[Yakında hazırlanacak]*

---

### 📹 Sorun Giderme Videoları

#### Video 6: Bağlantı Hatası Çözümü (2 dakika)
**YouTube Linki**: *[Yakında hazırlanacak]*

#### Video 7: Büyük Dosya Küçültme (5 dakika)
**YouTube Linki**: *[Yakında hazırlanacak]*

#### Video 8: Console Loglara Bakma (7 dakika)
**YouTube Linki**: *[Yakında hazırlanacak]*

---

## 🎓 Ek Kaynaklar

### 📄 Dokümantasyon
- **[README.md](README.md)**: Genel bakış ve teknik detaylar
- **[PRD.md](PRD.md)**: Ürün gereksinimleri (geliştiriciler için)
- **[TASKS.md](TASKS.md)**: Geliştirme yol haritası
- **[DOM_ANALYSIS.md](DOM_ANALYSIS.md)**: İkas DOM yapısı analizi

### 🌐 Faydalı Linkler
- **İkas Destek**: https://support.ikas.com/tr/
- **Chrome Extension Dokümanları**: https://developer.chrome.com/docs/extensions/
- **TinyJPG (Görsel Küçültme)**: https://tinyjpg.com

---

## 📞 Destek Alma

### Yöntem 1: GitHub Issues
1. https://github.com/veyselkilicerkan/kaff-ikas-otomasyon/issues
2. **[New Issue]** butonuna tıklayın
3. Sorununuzu detaylı anlatın:
   - Hangi işlemi yapıyordunuz?
   - Ne oldu? (ekran görüntüsü ekleyin)
   - Beklentiniz neydi?

### Yöntem 2: E-posta
**Geliştirici**: veysel@example.com

**Konu satırı**: `[KAFF Extension] - [Sorun Özeti]`

**Mail içeriği:**
```
Merhaba,

Extension versiyonu: v2.0.0
Chrome versiyonu: 120.0.6099.109
İşletim sistemi: Windows 11

Sorun:
[Detaylı açıklama buraya...]

Aldığım hata mesajı:
[Hata mesajı buraya...]

Ekler:
- Ekran görüntüsü
- Console logları (F12 → Console → sağ tık → Save As)

Teşekkürler!
```

---

## ✅ Başarı Kontrol Listesi

Extension'ı başarıyla kullanıyor musunuz? Kontrol edin:

- [ ] Extension kuruldu ve chrome'da görünüyor
- [ ] İkas varyant sayfasında extension açılıyor
- [ ] Fiyat güncelleme başarılı (test ürünle)
- [ ] Stok güncelleme başarılı (test ürünle)
- [ ] Klasör yapısı hazırlandı
- [ ] Görsel yükleme başarılı (test ürünle)
- [ ] Gerçek ürünlerde tüm özellikler test edildi
- [ ] Hata mesajlarını nasıl çözeceğimi biliyorum

✅ **Hepsini işaretlediniz mi? Tebrikler, artık uzman kullanıcısınız!** 🎉

---

## 🙏 Teşekkür

Bu kılavuzu kullandığınız için teşekkürler!

**Geri bildirim önemli:**
- 💚 Faydalı buldunuz mu? → GitHub'da yıldız verin ⭐
- 💬 Eksik bir konu var mı? → Issue açın
- 📧 Özel soru mu var? → E-posta gönderin

---

<div align="center">
  <img src="assets/icons/kaff-128.png" alt="KAFF Logo" width="64">
  <p><strong>KAFF İkas Otomasyonu v2.0.0</strong></p>
  <p><em>"Manuel işleri otomasyona çevirerek, değer yaratan işlere odaklanın."</em></p>
  <p>© 2026 Veysel Kılıçerkan - Tüm hakları saklıdır.</p>
</div>
