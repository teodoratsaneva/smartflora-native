# SmartFlora (React Native / Expo)

Мобилно приложение за грижа за растения — версия за iOS и Android, изградена с Expo и React Native.
Това е нов проект, независим от [smart-flora](https://github.com/teodoratsaneva/smart-flora) (нативния Android/Kotlin вариант), но споделя същия Firebase проект (`smartflora-80ab6`) за автентикация и данни.

## Firebase setup (задължително, преди първо пускане)

Приложението изисква Firebase конфигурация през environment променливи — никога не се хардкодва в кода.

1. Копирай `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```
2. Отиди във [Firebase Console](https://console.firebase.google.com/) → проект `smartflora-80ab6` → Project Settings → General → "Your apps" → добави Web app (или използвай вече регистрирания)
3. Копирай стойностите от показания `firebaseConfig` обект в `.env`
4. Отиди в Firestore Database → Rules и постави правилата от `firestore.rules` (виж по-долу) — **задължително**, иначе данните на потребителите остават публично четими/записваеми
5. Включи Email/Password като Sign-in method: Authentication → Sign-in method → Email/Password → Enable

`.env` е в `.gitignore` — никога не се комитва.

## Как да го пуснеш на iPhone (без Mac)

1. Инсталирай **Expo Go** от App Store на телефона си.
2. На компютъра, в тази папка:
   ```bash
   npm install
   npm start
   ```
3. Ще се появи QR код в терминала / браузъра.
4. Сканирай го с камерата на iPhone (или през Expo Go приложението) — SmartFlora ще се отвори на телефона ти за секунди, без Xcode, без Apple Developer акаунт.

Ако QR кодът не работи в локалната мрежа, пробвай `npx expo start --tunnel`, или ползвай web build-а (`npm run web` / деплойнатата версия в GitHub Pages).

Всяка промяна в кода се вижда на телефона почти веднага (hot reload).

## Текущо състояние

- Login / Register — реална Firebase Authentication (email/парола), reset на парола
- Home — списък с растения на текущия потребител, зареден на живо от Firestore
- Add Plant — добавяне на растение (вид + подвид от вграден каталог, снимка)
- Plant Details — health gauge, графика (7/31 дни), AI-стил анализ
- Add Care Data — sliders за температура/влажност, чекбокс за поливане

Данните се пазят в Firestore под `users/{uid}/plants/{plantId}`, изолирани по потребител.

## Следващи стъпки (feature parity с Kotlin версията)

- [ ] Perenual API интеграция за търсене на растения по вид
- [ ] Google Gemini интеграция за реален AI анализ (в момента анализът е генериран локално с прост алгоритъм)
- [ ] Firebase Storage за снимки на растения (в момента снимката е локален URI, не се качва в облак)
- [ ] Офлайн кеш (AsyncStorage) за преглед без интернет

## Полезни команди

```bash
npm start        # Expo dev server + QR код (iOS/Android)
npm run android  # Android емулатор/устройство
npm run ios      # само на Mac с Xcode
npm run web      # преглед в браузър
```
