# E-Ticaret Mikroservis Backend Projesi (Octopus Case)

Bu proje, Node.js, Express, TypeScript kullanarak geliştirilmiş bir e-ticaret mikroservis altyapısını içermektedir. Proje, farklı servisleri bir arada çalıştırmak için Docker konteynerleriyle yönetilmektedir. Her bir servis kendi veritabanına ve bazen de RabbitMQ'ya sahiptir. API Gateway, tüm mikroservislere tek bir noktadan erişimi sağlar.

## Proje Mimarisi

Bu projede toplamda 5 ana bileşen bulunmaktadır:

1. **User Service**: Kullanıcı yönetimi ve kimlik doğrulama işlemleri.
2. **Product Service**: Ürün yönetimi ve ürün veritabanı işlemleri.
3. **Cart Service**: Kullanıcı sepeti yönetimi.
4. **Order Service**: Sipariş yönetimi ve ödeme işlemleri.
5. **API Gateway**: Tüm mikroservislere yönlendirme yapan ana sunucu.

Bu servislerin her biri kendi veritabanına sahiptir ve RabbitMQ iletişim altyapısını kullanır.

## Teknolojiler

- **Node.js**: Sunucu tarafı uygulama.
- **Express**: API'ler için RESTful framework.
- **TypeScript**: Statik tip kontrolü ile geliştirme.
- **Docker**: Mikroservislerin izole bir şekilde çalıştırılması.
- **RabbitMQ**: Mikroservisler arası asenkron iletişim.
- **MongoDB**: Cart ve Product servisleri için veritabanı.
- **PostgreSQL**: User servisinin veritabanı.
- **MySQL**: Order servisinin veritabanı.

## Başlangıç

Projeyi yerel ortamda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Prerequisites (Gereksinimler)

- **Docker**: Projenin tüm servislerini çalıştırmak için Docker'ı bilgisayarınızda kurmuş olmanız gerekir.
- **Docker Compose**: Mikroservisleri bir arada yönetmek için Docker Compose kullanılır.

### Adımlar

1. **Docker Compose İle Servisleri Başlatma**
   Tüm mikroservisleri ve RabbitMQ'yu başlatmak için aşağıdaki komutu çalıştırın:

   ```bash
   docker-compose up --build
   ```

   Bu komut, gerekli Docker imajlarını indirir ve tüm servisleri başlatır.

2. **API Gateway**
   API Gateway servisi, `http://localhost:3000` adresinde çalışacaktır. API Gateway üzerinden aşağıdaki servislerle iletişim kurabilirsiniz:

   - `http://localhost:3000/cart` - Cart Service
   - `http://localhost:3000/order` - Order Service
   - `http://localhost:3000/product` - Product Service
   - `http://localhost:3000/user` - User Service

3. **Servisleri Test Etme**
   API Gateway üzerinden servislere yönlendirme yapılabilir. Örneğin:

   - `POST http://localhost:3000/login` - Kullanıcı girişi
   - `POST http://localhost:3000/register` - Kullanıcı kaydı

4. **RabbitMQ**
   RabbitMQ servisinin yönetim paneline `http://localhost:15672` adresinden erişebilirsiniz. Varsayılan kullanıcı adı ve şifre: `guest / guest`.

### Servisler Arası Bağlantılar

Her bir servis kendi veritabanına sahiptir ve RabbitMQ ile asenkron mesajlaşma yapar. Servisler birbirleriyle şu yollarla iletişim kurar:

- **User Service**: Kullanıcı kaydı ve girişi işlemlerini yönetir.
- **Product Service**: Ürünleri ekler, günceller, siler ve listeler.
- **Cart Service**: Kullanıcıların sepetlerini yönetir.
- **Order Service**: Kullanıcı siparişlerini oluşturur ve yönetir.
- **API Gateway**: Tüm servislerin birleştiği noktadır. Dışarıya servislerin API'lerini sunar.

### Notlar

- **API Gateway**, tüm servisleri yönlendiren bir ters proxy olarak çalışır. Bu, dış dünyadan gelen talepleri ilgili mikroservislere iletir.
- **RabbitMQ**, mikroservisler arasında asenkron mesajlaşmayı sağlar ve servislerin birbirine bağımsız çalışmasına olanak tanır.
- Her servis için ayrı veritabanları (MongoDB, MySQL, PostgreSQL) kullanılmıştır.

- **ÖNEMLİ NOT**: **Uzun süredir iş arama sürecinde olduğumdan dolayı geçimimi sağlamak adına alanım olmayan bir sektörde çalışmaktayım. Sizden harici görüştüğüm diğer firmalar da case yollamakta olduğundan dolayı ciddi zaman problemleri yaşadım ve maalesef bu case'de istediğiniz bazı şeyleri yetiştiremedim. Bunlar; API Dökümantasyonu (Swagger), Detaylandırılabilir endpointler ve bazı rabbitmq kuyrukları (sipariş işlemleri için gereken arkaplan işleri). Tabi ki bunlar birer bahane değildir. Yalnızca değerlendirirken, kalan eksiklikleri yerine getirebileceğimi fakat hayat şartları nedeniyle yetiştiremediğimi bilmenizi isterim.**
