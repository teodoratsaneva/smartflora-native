# SmartFlora (React Native / Expo)

Мобилно приложение за грижа за растения — версия за iOS и Android, изградена с Expo и React Native.
Това е нов проект, независим от [smart-flora](https://github.com/teodoratsaneva/smart-flora) (нативния Android/Kotlin вариант).

## Как да го пуснеш на iPhone (без Mac)

1. Инсталирай **Expo Go** от App Store на телефона си.
2. На компютъра, в тази папка:
   ```bash
   npm install
   npm start
   ```
3. Ще се появи QR код в терминала / браузъра.
4. Сканирай го с камерата на iPhone (или през Expo Go приложението) — SmartFlora ще се отвори на телефона ти за секунди, без Xcode, без Apple Developer акаунт.

Всяка промяна в кода се вижда на телефона почти веднага (hot reload).

## Текущо състояние

Скелет с навигация и всички основни екрани, огледални на Android версията:

- Login / Register (все още без реална автентикация)
- Home — списък с растения
- Add Plant — добавяне на растение (базово, без търсене по API)
- Plant Details — история на грижите + AI резултат (placeholder)
- Add Care Data — въвеждане на дневни данни (влажност, температура, поливане)

Данните в момента се пазят само в паметта на приложението (изчезват при рестарт).

## Следващи стъпки (feature parity с Kotlin версията)

- [ ] Firebase Auth + Firestore (истинско съхранение, вместо in-memory store)
- [ ] Perenual API интеграция за търсене на растения по вид
- [ ] Google Gemini интеграция за AI анализ
- [ ] Локално съхранение (AsyncStorage / SQLite) за офлайн работа
- [ ] Ключове и конфигурация през `.env` / `app.config.ts` + `expo-secure-store` (никога хардкоднати в кода)

## Полезни команди

```bash
npm start        # Expo dev server + QR код (iOS/Android)
npm run android  # Android емулатор/устройство
npm run ios      # само на Mac с Xcode
npm run web      # преглед в браузър
```
