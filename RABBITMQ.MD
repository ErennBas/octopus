# RabbitMQ Entegrasyonu

Bu projede, RabbitMQ mikroservisler arası iletişim ve asenkron işleme için kullanılmaktadır. RabbitMQ, iki ana işlem için kuyruğa görevler ekler ve ilgili servisler bu görevleri işler. Aşağıda, RabbitMQ entegrasyonunun nasıl çalıştığına dair detaylı açıklamalar bulunmaktadır.

## RabbitMQ Kuyrukları

### 1. **Yeni Kullanıcı Kaydı (Email Gönderme)**
Yeni bir kullanıcı kaydedildiğinde, bu işlemle ilgili bir görev **`email_queue`** kuyruğuna eklenir. Bu görev, kullanıcı kaydının tamamlandığını bildiren bir e-posta göndermek için **User Service** tarafından işlenir.

#### İş Akışı:
1. **User Service**: Yeni kullanıcı kaydı yapıldığında, RabbitMQ'ya bir mesaj gönderilir. Bu mesaj, kullanıcının e-posta adresi ve diğer gerekli bilgileri içerir.
2. **RabbitMQ**: Mesaj, `email_queue` kuyruğuna eklenir.
3. **User Service**: User Service, RabbitMQ'ya bağlanarak `email_queue` kuyruğundaki mesajları dinler ve ilgili e-posta gönderme işlemini gerçekleştirir.

#### Kuyruk Yapısı:
- **Kuyruk Adı**: `email_queue`
- **Mesaj İçeriği**: Kullanıcı bilgileri (örneğin, e-posta adresi ve kullanıcı bilgileri)

---

### 2. **Ürün Stok Güncelleme**
Bir ürünün stok miktarı güncellendiğinde, bu işlem **`cart_update_queue`** kuyruğuna bir görev ekler. Bu görev, sepet işlemlerini güncellemek için **Cart Service** tarafından işlenir.

#### İş Akışı:
1. **Product Service**: Ürün stok miktarı güncellenir. Bu işlem, RabbitMQ'ya bir mesaj gönderir.
2. **RabbitMQ**: Mesaj, `cart_update_queue` kuyruğuna eklenir.
3. **Cart Service**: Cart Service, RabbitMQ'ya bağlanarak `cart_update_queue` kuyruğundaki mesajları dinler ve sepet güncelleme işlemini gerçekleştirir.

#### Kuyruk Yapısı:
- **Kuyruk Adı**: `cart_update_queue`
- **Mesaj İçeriği**: Ürün bilgileri (örneğin, `productId`, `quantity`)
