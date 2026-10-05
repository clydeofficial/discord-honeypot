# 🍯 Honeypot — Discord Spam Tuzağı Botu

Sunucunuzu spam botlarından otomatik koruyan, kurulumu 5 dakika süren açık kaynaklı Discord bot altyapısı.

> Bu proje, [RiskyMH/honeypot](https://github.com/RiskyMH/honeypot) projesinden ilhamla yapılmıştır.

## Özellikler

- Honeypot kanalına yazan spam hesabı anında cezalandırır
- İki ceza modu: `softban` ve `ban`
- Son 1 saatin mesajlarını otomatik siler (ayarlanabilir)
- Log kanalına kayıt düşer
- Opsiyonel rastgele kanal ismi: tuzak kanalın adı belirlediğiniz aralıklarla otomatik değişir
- Rol hiyerarşisi ve yetkili muafiyeti ile güvenli çalışır

## Nasıl Çalışır?

1. Bot, `HONEYPOT_CHANNEL_ID` olarak verdiğiniz kanala uyarı kartı gönderir.
2. Normal üyeler bu kanalı görmezden gelir. Spam botları ise tüm kanallara aynı anda yazdığı için tuzağa düşer.
3. Tuzağa düşen kullanıcı:
   - `ACTION=softban` ise: banlanır, son mesajları silinir, banı hemen geri açılır. Kullanıcı sunucuya tekrar katılabilir ama spam mesajları temizlenmiş olur.
   - `ACTION=ban` ise: banlanır, son mesajları silinir, banı açılmaz.
4. `LOG_CHANNEL_ID` kanalına ise kayıt düşer.

## Gereksinimler

- Node.js 18 veya üzeri
- Bir Discord uygulaması ve bot tokeni
- Sunucuda **Geliştirici Modu** açık bir Discord hesabı (ID kopyalamak için)

## Kurulum

### 1. Discord uygulamasını oluşturun

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin.
2. **New Application** deyin, bir isim verin.
3. Sol menüden **Bot** sekmesine geçin, **Reset Token** ile tokeni alıp saklayın.
4. Aynı sayfadaki **Privileged Gateway Intents** bölümünde şunları açın (zorunlu):
   - **Server Members Intent**
   - **Message Content Intent**

### 2. Botu sunucuya davet edin

Botun çalışması için en az şu izinler gerekir:

- Üyeleri Yasakla (Ban Members)
- Kanalları Yönet (Manage Channels — rastgele kanal ismi açıksa zorunlu, kapalıysa gerekmez)
- Mesajları Yönet (Manage Messages)
- Kanalları Görüntüle (View Channel)
- Mesaj Gönder (Send Messages)

Örnek davet bağlantısı (`CLIENT_ID` kısmını kendi uygulamanızın ID'si ile değiştirin):

```text
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=93204&scope=bot+applications.commands
```

Önemli: Botun rolünü, cezalandıracağı üyelerin rollerinin **üzerine** taşıyın. Aksi halde Discord, rol hiyerarşisi gereği ban işlemine izin vermez.

### 3. Kanal ID'lerini alın

1. Discord'da **Kullanıcı Ayarları > Gelişmiş > Geliştirici Modu** seçeneğini açın.
2. Honeypot olarak kullanacağınız kanala sağ tıklayıp **ID'yi Kopyala** deyin.
3. Log kanalı için aynı işlemi tekrarlayın.

### 4. Değişkenleri Ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasını doldurun:

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `TOKEN` | Evet | – | Bot tokeniniz |
| `HONEYPOT_CHANNEL_ID` | Evet | – | Tuzak kanalı ID'si |
| `LOG_CHANNEL_ID` | Evet | – | Ceza kayıtlarının düşeceği kanal ID'si |
| `ACTION` | Hayır | `softban` | `softban` ya da `ban` |
| `RANDOM_CHANNEL_NAME` | Hayır | `false` | `true` ise tuzak kanalın ismi her gün otomatik değişir |

### 5. Botu başlatın

```bash
npm install
npm start
```

Geliştirme modunda (dosya değişince otomatik yeniden başlatır):

```bash
npm run dev
```

Bot açıldığında honeypot kanalına uyarı kartını otomatik gönderir. Kart zaten varsa tekrar göndermez.

## Rastgele Kanal İsmi (Opsiyonel)

Spam botları `honeypot` adını kara listeye aldığı için kanalın adını düzenli değiştirmek tuzağın yakalama oranını artırır.

`.env` dosyasında açın:

```env
RANDOM_CHANNEL_NAME=true
```

- `RANDOM_CHANNEL_NAME=true` ise bot, açılışta ve her gün kanal ismini listedeki tuzak isimlerden rastgele biriyle değiştirir (örnek: `mesaj-yazma`, `konuşma-yok`). Liste bu projeye özel hazırlanmıştır (`src/utils/channelNames.js`).
- Spam botları `honeypot` adını kara listeye aldığı için kanalın adını düzenli değiştirmek tuzağın yakalama oranını artırır.
- Bu özellik için botta **Kanalları Yönet** izni şarttır. İsim değiştirilemezse log kanalına uyarı düşer.

## Sıkça Sorulan Sorular

**Normal üyeler yanlışlıkla banlanır mı?**
Hayır. Bot yalnızca honeypot kanalına yazanlara işlem yapar. Kurala uyan üyeler bu kanala yazmadığı sürece güvendedir.

**Sunucu sahibi ya da yetkililer etkilenir mi?**
Hayır. Sunucu sahibi ve **Sunucuyu Yönet** yetkisi olanlar otomatik olarak muaf tutulur.

**Butondaki sayaç ne işe yarar?**
Tuzağa düşen toplam kullanıcı sayısını gösterir. Butona tıklayan, güncel sayıyı gizli mesaj olarak görür.

**softban ile ban arasındaki fark nedir?**
Softban, banlayıp hemen banı geri açar. Böylece kullanıcının son mesajları silinir ama tekrar katılabilir. Ban ise kalıcıdır.

## Destek

- Yardım için Discord sunucumuz: `https://discord.gg/uSkGQmsbPv`
- Video anlatım ve güncellemeler için YouTube kanalımız: `https://www.youtube.com/@ClydeResmi`
