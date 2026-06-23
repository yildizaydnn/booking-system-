# CLAUDE.md — Booking System

Bu dosya projenin kök dizininde bulunur ve tüm workspace'i kapsar.
Her alt projenin kendi CLAUDE.md'si vardır; bu dosya yalnızca genel yapıyı ve ortak kuralları tanımlar.

---

## Proje Yapısı

```
booking-system/
├── CLAUDE.md                   ← bu dosya
├── MANIFEST.md                 ← projenin ne olduğu (teknik olmayan açıklama)
├── TECHNICAL_OVERVIEW.md       ← mimari ve teknoloji kararları
├── frontend/                   ← React + Vite backoffice uygulaması
│   ├── CLAUDE.md               ← frontend'e özgü kurallar, component yapısı
│   └── ...
└── backend/                    ← NestJS REST API
    ├── CLAUDE.md               ← backend'e özgü kurallar, modül yapısı
    └── ...
```

---

## Alt Projeler

### `frontend/`

React 18 + Vite ile geliştirilmiş backoffice paneli.
Detaylı kurallar, component yapısı ve stil kararları için → `frontend/CLAUDE.md`

### `backend/`

NestJS + TypeORM ile geliştirilmiş REST API.
Detaylı kurallar, modül yapısı ve servis kararları için → `backend/CLAUDE.md`

---

## Genel Kurallar (Tüm Proje)

### Dil

- Kod içi değişken, fonksiyon, sınıf, dosya adları → **İngilizce**
- Kod içi yorumlar (comment) → **İngilizce**
- Commit mesajları → **İngilizce**
- Dokümantasyon dosyaları (MD) → **Türkçe**

### Commit Mesajı Formatı

```
<type>(<scope>): <kısa açıklama>

feat(appointments): add conflict prevention with pessimistic locking
fix(auth): handle expired refresh token edge case
docs(backend): update module structure in CLAUDE.md
test(appointments): add unit tests for overlap detection
```

Geçerli type'lar: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`

### Branch Stratejisi

```
main          → kararlı, her zaman çalışan kod
dev           → aktif geliştirme branch'i
feature/*     → yeni özellikler (örn: feature/appointment-locking)
fix/*         → hata düzeltmeleri
```

### Ortam Değişkenleri

- Hassas bilgiler (şifre, secret, API key) asla koda yazılmaz
- Her alt proje kendi `.env.example` dosyasını içerir
- `.env` dosyaları `.gitignore`'a eklenir, repository'e commit edilmez

### Docker

- Her alt proje kendi `Dockerfile`'ına sahiptir

---

## Referans Belgeler

| Belge                   | Açıklama                                                 |
| ----------------------- | -------------------------------------------------------- |
| `MANIFEST.md`           | Projenin amacı, hedef kitlesi, temel ilkeler             |
| `TECHNICAL_OVERVIEW.md` | Mimari diyagram, teknoloji seçimleri, güvenlik kararları |
| `frontend/CLAUDE.md`    | Frontend kuralları ve yapısı                             |
| `backend/CLAUDE.md`     | Backend kuralları ve yapısı                              |
