# Slotify — Technical Overview

## Genel Mimari

Slotify, **backoffice odaklı** bir web uygulamasıdır. Sistem; bir React/Vite frontend, bir NestJS backend ve bir PostgreSQL veritabanından oluşur. Tüm servisler Docker ile containerize edilir ve birbirleriyle izole ağlar üzerinden iletişim kurar.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│              React + Vite  (Backoffice UI)           │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼────────────────────────────┐
│                   BACKEND (NestJS)                   │
│         REST API  │  Auth  │  Business Logic         │
│                   │        │                         │
│              TypeORM (ORM Layer)                     │
└──────┬─────────────────────────────────┬────────────┘
       │                                 │
┌──────▼──────┐                 ┌────────▼────────────┐
│ PostgreSQL  │                 │      Graylog         │
│  (Database) │                 │  (Log Management)    │
└─────────────┘                 └─────────────────────┘
```

---

## Frontend

**Teknoloji:** React 18 + Vite

Bu uygulama bir backoffice panelidir; halka açık bir müşteri arayüzü değildir. Yalnızca yetkili kullanıcılar (işletme sahipleri, platform yöneticisi) erişebilir.

**Sorumluluklar:**
- Kullanıcı girişi ve oturum yönetimi (JWT token saklama)
- İşletme, hizmet ve personel yönetim ekranları
- Randevu takvimi ve liste görünümü
- Kullanıcı rol ve izin yönetimi
- Raporlama ve istatistik ekranları

**Klasör Yapısı:**
```
src/
├── api/           → Backend ile iletişim kuran servis katmanı (axios)
├── components/    → Tekrar kullanılabilir UI bileşenleri
├── pages/         → Route bazlı sayfa bileşenleri
├── store/         → Global state yönetimi (Context veya Zustand)
├── hooks/         → Custom React hook'ları
└── utils/         → Yardımcı fonksiyonlar, sabitler
```

**Önemli Kararlar:**
- Vite tercih edildi — Create React App'e göre çok daha hızlı build süresi, modern ESModule yapısı
- API çağrıları merkezi bir `api/` katmanında tutulur; component içine axios yazılmaz
- Auth token'ı `httpOnly cookie` veya `memory` üzerinde tutulur, `localStorage`'a yazılmaz (XSS koruması)

---

## Backend

**Teknoloji:** NestJS + TypeORM

NestJS'in modüler mimarisi, her domain'in (auth, business, appointment, user) kendi modülüne izole edilmesini sağlar. Bu yapı hem test edilebilirliği hem de büyüme sürecinde kod okunabilirliğini artırır.

**Klasör Yapısı:**
```
src/
├── auth/              → JWT stratejisi, login/logout, token yenileme
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── roles.guard.ts
│
├── users/             → Kullanıcı CRUD, rol atama
│
├── businesses/        → İşletme yönetimi (oluştur, düzenle, listele)
│
├── services/          → İşletmeye ait hizmet tanımları (süre, fiyat)
│
├── appointments/      → Randevu oluşturma, listeleme, iptal
│   ├── appointments.service.ts   ← transaction/locking logic
│   └── appointments.spec.ts      ← unit testler
│
├── availability/      → Çalışma saatleri ve müsait slot hesaplama
│
├── notifications/     → E-posta bildirimleri (randevu onayı, hatırlatma)
│
├── common/            → Guard'lar, interceptor'lar, decorator'lar, filtreler
│
└── config/            → Ortam değişkenleri, uygulama konfigürasyonu
```

**Önemli Kararlar:**
- Her modül kendi `Controller → Service → Repository` katmanına sahip; business logic Controller'a yazılmaz
- `Guards` ile rol kontrolü endpoint bazında yapılır (`@Roles('BUSINESS_OWNER')`)
- Global `ExceptionFilter` tüm hataları yakalar; Graylog'a structured log olarak iletir
- Tüm dış servis çağrıları (email vb.) bağımsız modüllere alınır; test sırasında mock'lanabilir

---

## Veritabanı

**Teknoloji:** PostgreSQL 16 + TypeORM

**Temel Tablolar:**

```
users
├── id (uuid)
├── email
├── password_hash
├── role           → SUPER_ADMIN | BUSINESS_OWNER | CUSTOMER
└── created_at

businesses
├── id (uuid)
├── owner_id       → users.id (FK)
├── name
├── slug           → URL'de kullanılan benzersiz tanımlayıcı (örn: /berber-ahmet)
└── working_hours  → JSONB

services
├── id (uuid)
├── business_id    → businesses.id (FK)
├── name
├── duration_minutes
└── price

appointments
├── id (uuid)
├── business_id    → businesses.id (FK)
├── service_id     → services.id (FK)
├── customer_id    → users.id (FK)
├── start_time     → timestamp with time zone
├── end_time       → timestamp with time zone
└── status         → PENDING | CONFIRMED | CANCELLED
```

**Çakışma Önleme (Concurrency):**

Aynı saate birden fazla randevunun düşmesini engellemek için PostgreSQL'in `SELECT FOR UPDATE` (pessimistic locking) mekanizması kullanılır. Randevu oluşturma işlemi bir transaction içinde gerçekleşir:

```
BEGIN TRANSACTION
  → Çakışan randevu var mı? (FOR UPDATE ile kilitle)
  → Yoksa INSERT et
  → Varsa hata fırlat
COMMIT
```

Bu yaklaşım, eş zamanlı iki isteğin aynı slota randevu yazmasını veritabanı katmanında engeller. Uygulama katmanındaki kontroller ikinci bir güvence olarak kalır.

**Multi-Tenant İzolasyon:**

Her sorgu `business_id` filtresi içerir. Bir işletme sahibi yalnızca kendi verisini görebilir ve değiştirebilir. Bu kural TypeORM repository katmanında zorunlu hale getirilir; controller'a bırakılmaz.

---

## Loglama

**Teknoloji:** Graylog

Uygulama logları Graylog'a **GELF (Graylog Extended Log Format)** protokolü üzerinden iletilir. Her log kaydı yapılandırılmış (structured) formatta gönderilir.

**Log Seviyeleri ve Kullanımı:**

| Seviye | Ne Zaman |
|--------|----------|
| `INFO` | Başarılı işlemler (randevu oluşturuldu, kullanıcı giriş yaptı) |
| `WARN` | Beklenmeyen ama kırıcı olmayan durumlar (geçersiz token denemesi) |
| `ERROR` | İşlem başarısız (DB hatası, dış servis hatası) |
| `DEBUG` | Geliştirme ortamında detaylı iz (production'da kapalı) |

**Her Log Kaydında Bulunacak Alanlar:**
```json
{
  "timestamp": "2025-06-23T10:00:00Z",
  "level": "INFO",
  "service": "appointments",
  "action": "CREATE",
  "business_id": "uuid",
  "user_id": "uuid",
  "message": "Appointment created successfully",
  "duration_ms": 42
}
```

**Önemli Kararlar:**
- Kişisel veri (ad, e-posta, telefon) loglara yazılmaz; yalnızca ID'ler loglanır
- Her request `X-Request-ID` header'ı taşır; bu ID tüm log zincirinde izlenebilir (distributed tracing temeli)
- NestJS interceptor katmanında her gelen isteğin süresi ve sonucu otomatik loglanır

---

## CI/CD

**Teknoloji:** Docker + GitHub Actions

**Docker Compose Servisleri:**

```yaml
services:
  api:          # NestJS backend
  web:          # React/Vite frontend (nginx ile serve edilir)
  db:           # PostgreSQL
  graylog:      # Log yönetimi
  mongo:        # Graylog'un kendi metadata veritabanı
  elasticsearch:# Graylog'un arama motoru
```

**GitHub Actions Pipeline:**

```
Pull Request açıldığında:
  ├── Lint (ESLint + Prettier kontrolü)
  ├── Unit testler çalışır (Jest)
  └── Build kontrolü (TypeScript derleme hatası var mı?)

Main branch'e merge edildiğinde:
  ├── Tüm testler tekrar çalışır
  ├── Docker image build edilir
  └── (Opsiyonel) Staging ortamına deploy
```

**Ortam Değişkenleri:**

Tüm hassas bilgiler (DB şifresi, JWT secret, SMTP credentials) `.env` dosyasında tutulur. `.env` dosyası `.gitignore`'a eklenir; repository'e asla commit edilmez. GitHub Actions'da bu değerler `Secrets` olarak tanımlanır.

---

## Güvenlik

- **Kimlik Doğrulama:** JWT (access token kısa ömürlü, refresh token ile yenileme)
- **Yetkilendirme:** Role-based access control (RBAC) — her endpoint hangi role açık olduğunu açıkça belirtir
- **Şifre:** bcrypt ile hash'lenir, plain text asla veritabanına yazılmaz
- **Rate Limiting:** Brute force saldırılarına karşı login endpoint'ine istek sınırı uygulanır
- **CORS:** Yalnızca tanımlı origin'lerden gelen istekler kabul edilir
- **SQL Injection:** TypeORM parametric query kullanır; raw SQL yazılmaz

---

## Geliştirme Ortamı Gereksinimleri

| Araç | Versiyon |
|------|----------|
| Node.js | 20 LTS |
| npm / pnpm | 9+ |
| Docker Desktop | 4.x |
| PostgreSQL | 16 (Docker üzerinden) |

---

*Bu belge projenin teknik mimarisini ve teknoloji kararlarını belgeler. Kod örnekleri ve detaylı API dokümantasyonu ayrı dosyalarda tutulur.*
