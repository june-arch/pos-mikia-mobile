# 📱 POS Mikia Mobile - Point of Sale System

A modern mobile POS system built with React Native, Expo, and Supabase for retail businesses.

## 🏗️ Architecture

**Mobile App (React Native):**
- Framework: React Native + Expo
- Language: TypeScript
- UI: React Native components with shared design system
- State: Zustand
- Database: Supabase (PostgreSQL + Auth + Storage)
- Authentication: Supabase Auth
- Navigation: React Navigation

**Shared Contracts:**
- `@pos-mikia/shared` - TypeScript interfaces, constants, and enums

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Expo CLI (for mobile development)
- Android Studio or Xcode (for device testing)

### Setup

1. **Clone and install dependencies:**
```bash
git clone <repository>
cd pos-mikia
npm run install:all
```

2. **Environment setup:**
```bash
cp .env.example .env
# Update .env with your Supabase credentials
```

3. **Start development server:**
```bash
npm run dev
```

4. **Run on device:**
```bash
npm run android    # For Android
npm run ios        # For iOS
```

## 📱 Features

### Core POS Features
- ✅ **Product Management** - Browse, search, and manage products
- ✅ **Shopping Cart** - Add/remove items, quantity controls
- ✅ **Barcode Scanning** - Camera-based barcode detection
- ✅ **Receipt Printing** - Bluetooth printer integration
- ✅ **Authentication** - User login/logout with role management

### Technical Features
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **State Management** - Zustand stores
- ✅ **Offline Support** - AsyncStorage for session persistence
- ✅ **Navigation** - Tab-based interface
- ✅ **Error Handling** - Comprehensive error management

## 📊 Project Structure

```
pos-mikia/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── services/      # API and auth services
│   │   ├── store/         # Zustand stores
│   │   └── lib/           # Supabase client
│   ├── assets/            # Images and icons
│   └── App.tsx           # Main app component
├── shared/                # Shared contracts
│   ├── contracts.ts       # TypeScript interfaces
│   ├── constants.ts       # App constants
│   ├── enums.ts          # Enum definitions
│   └── index.ts          # Main export file
└── package.json          # Root package.json
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run build` - Build for production
- `npm run install:all` - Install all dependencies

### Environment Variables

Create `.env` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 Deployment

### Play Store Deployment

1. **Build APK:**
```bash
cd mobile
npx eas build --platform android
```

2. **Submit to Play Store:**
- Upload APK to Google Play Console
- Complete store listing
- Submit for review

### App Store Deployment

1. **Build iOS:**
```bash
cd mobile
npx eas build --platform ios
```

2. **Submit to App Store:**
- Upload IPA to App Store Connect
- Complete store listing
- Submit for review

## 🛠️ Technologies

- **Frontend:** React Native, Expo, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State:** Zustand
- **Navigation:** React Navigation
- **UI:** React Native components
- **Build:** Expo EAS

## 📋 Requirements

- **Node.js:** 18.0.0+
- **npm:** 8.0.0+
- **Expo CLI:** Latest version
- **React Native:** Compatible version

## 🔐 Security

- Supabase Row Level Security (RLS)
- JWT authentication
- Environment variable protection
- Secure API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check documentation
- Join our Discord community

---

**Built with ❤️ for retail businesses**
