# Map Tiles Downloader

**Tarihsel karşılaştırma özellikleriyle harita kutucuklarını indirmek için kolay kullanımlı bir arayüz**

<p align="center">
  <img src="gif/map-tiles-downloader.gif">
</p>

## Ne işe yarar?

Bu küçük Python tabanlı betik, Google, Bing, Open Street Maps, ESRI, NASA ve diğer sağlayıcılardan harita kutucuklarını indirmenize olanak tanır. Bu betik, bölge seçimi ve kutucuk önizlemesi için kullanımı kolay web tabanlı bir harita arayüzü ile birlikte gelir. Artık afet analizi ve zamansal çalışmalar için tarihsel uydu görüntüsü karşılaştırma özelliği de mevcut!

**Betiği komut satırından çalıştırmanız yeterli**

```sh
python server.py
```

Ardından web tarayıcınızı açın ve `http://localhost:8080` adresine gidin. İndirilen harita kutucukları varsayılan olarak `output\{timestamp}\` dizininde olacaktır.

## Gereksinimler

**Python 3.10+** (Python 3.13 ile uyumlu), [Pillow](https://pypi.org/project/Pillow/) kütüphanesi (sürüm 10.0.0+) ve modern bir web tarayıcısı gerektirir. Bağımlılıkları yüklemek için:

```sh
pip install -r src/requirements.txt
```

Uygulama, başlatma sırasında gerekli `temp/` ve `output/` dizinlerini otomatik olarak oluşturacaktır.

## Docker İle Kullanım

Docker, uygulamaları kurmak ve çalıştırmak için oldukça basit bir yoldur. [Docker'ı sisteminize kurun](https://www.docker.com/products/docker-desktop) ve komut satırınıza şunu yapıştırın:

```sh
docker run -v $PWD/output:/app/output/ -p 8080:8080 -it aliashraf/map-tiles-downloader
```

Şimdi tarayıcıyı açın ve `http://localhost:8080` adresine gidin. İndirilen haritalar `output` dizininde saklanacaktır.

## Amaç

Hobi olarak harita ile ilgili şeyler tasarlıyorum ve genellikle yerel sistemimde saklanması gereken kutucuklar içeren çevrimdışı haritalarla çalışmam gerekiyor. Kutucukları indirmek biraz baş ağrıtıcı ve mevcut çözümlerin kullanıcı deneyimi sorunları var. Bu yüzden çalışmamı hızlandırmak için bu küçük betiği birkaç saat içinde oluşturdum.

Proje, tarihsel uydu görüntüsü karşılaştırması yoluyla afet etkisi analizi dahil olmak üzere eğitim ve araştırma amaçlarını destekleyecek şekilde gelişmiştir.

## Özellikler

- Bölge ve seçenekleri belirlemek için kullanımı çok kolay harita arayüzü
- **YENİ:** Yıl bazlı kaydırıcılarla tarihsel uydu görüntüleri
- **YENİ:** Öncesi/sonrası analizi için karşılaştırmalı indirme modu
- **YENİ:** Tarihsel görüntüler için birden fazla Google API formatı
- **YENİ:** Geliştirilmiş hata işleme ve zaman aşımları
- **YENİ:** Gerçek zamanlı ilerleme takibi ve istatistikler
- **YENİ:** Python 3.13 ve modern kütüphanelerle uyumluluk
- Paralel indirme için çoklu iş parçacığı
- Python ve bir tarayıcıya sahip olduğu sürece herhangi bir işletim sisteminde çalışabilme
- Kolay kurulum için Dockerfile mevcut
- 2x/Hi-Res/Retina/512x512 kutucukları birden fazla kutucuğu birleştirerek destekler
- Dosya ve mbtile formatında indirmeyi destekler
- Tek seferde birden fazla zoom seviyesi seçimi
- Daha önce indirilmiş kutucukları atlama özelliği
- Özel dosya adı formatı belirtme imkanı
- URL'de `x`, `y`, `z` veya `quad` içerdiği sürece HERHANGİ bir kutucuk sağlayıcısını destekler
- MapBox :heart: kullanılarak oluşturulmuştur

## Tarihsel Harita Analizi Kullanımı

Uygulama artık karşılaştırmalı analiz için tarihsel uydu görüntüsü indirmeyi destekliyor:

1. İlgilendiğiniz bölgeyi seçmek için haritada bir dikdörtgen çizin
2. Kenar çubuğundan **Map Analysis (+)** menüsünü açın
3. Yıl kaydırıcısını kullanarak birincil dönemi seçin
4. Birden fazla zaman dilimini indirmek istiyorsanız **Comparative Download**'ı etkinleştirin
5. İkinci yıl kaydırıcısından karşılaştırma dönemini seçin
6. Bölgeniz için çalışmazsa farklı Google API formatları arasından seçim yapın
7. İşlemi başlatmak için **Download**'a tıklayın

Uygulama, her iki zaman dilimi için kutucukları indirecek ve kolay karşılaştırma için aynı coğrafi alanı koruyacaktır. Bu özellikle şunlar için kullanışlıdır:

- Afet etkisi değerlendirmesi (doğal afetler öncesi/sonrası)
- Kentsel gelişim çalışmaları
- Çevresel değişim izleme
- Veri biliminde eğitim amaçları

## Performans Optimizasyonları

Uygulama, çeşitli performans iyileştirmeleri içerir:

- Uygun zaman aşımlarıyla optimize edilmiş HTTP bağlantıları (kutucuklar için 45sn, metadata için 60sn)
- Otomatik yeniden denemelerle geliştirilmiş hata işleme
- İndirme hızı göstergeleri ile gerçek zamanlı ilerleme takibi
- Geliştirilmiş çoklu iş parçacıklı indirme
- Uygun bağlantı yönetimi ile bellek sızıntısı önleme

## Önemli Uyarı

Harita kutucuklarını indirmek, kutucuk sağlayıcısının şart ve koşullarına tabidir. Google Maps gibi bazı sağlayıcılar, kötüye kullanımı önlemek için kısıtlamalar getirmiştir, bu nedenle herhangi bir kutucuğu indirmeden önce onların Kullanım Koşullarını anladığınızdan emin olun. Google, Bing ve ESRI kutucuklarını, onların izni olmadan ticari bir uygulamada kullanmamanızı öneririm.

## İletişimde Kalın

En son sürümler ve duyurular için sitemi ziyaret edin: [aliashraf.net](http://aliashraf.net)

## Son Güncellemeler

- Python 3.13 desteği eklendi
- Kullanımdan kaldırılmış CGI modülü modern alternatiflerle değiştirildi
- Dinamik buton konumlandırma ile geliştirilmiş kullanıcı arayüzü
- Geliştirilmiş hata işleme ve bağlantı yönetimi
- Birden fazla API formatıyla tarihsel uydu görüntüleri eklendi
- Öncesi/sonrası analizi için karşılaştırmalı indirme modu eklendi
- Gerçek zamanlı ilerleme takibi uygulandı
- Tarihsel kutucuk parametreleri için URL işleme düzeltildi

**"Analizciler & Veri Bilimciler için Uyumlaştırma ve Yeni Kabiliyetler: Mustafa Barış Arslantaş 2025"**

## Lisans

Bu yazılım [MIT Lisansı](LICENSE) altında yayınlanmıştır. Yazılımın kullanılabilirliği ve dağıtımı hakkında bilgi için lütfen LİSANS dosyasını okuyun.

Telif hakkı (c) 2020-2025 [Ali Ashraf](http://aliashraf.net)