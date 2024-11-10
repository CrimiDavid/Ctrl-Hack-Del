# Ctrl-Hack-Del Mobile App

A community-focused mobile application built with React Native and Expo, featuring real-time messaging, event management, and location-based services.

## 🚀 Features

- **Authentication System**
  - User registration and login
  - Secure session management
  - Protected routes

- **Interactive Map**
  - Location-based community pins
  - Custom map styling
  - Real-time location updates

- **Messaging System**
  - Real-time chat functionality
  - Group conversations
  - Message history

- **Community Management**
  - Create and join communities
  - Event organization
  - Member management

- **Dark Mode Support**
  - System-wide theme management
  - Persistent theme settings
  - Native UI elements adaptation

## 🛠 Technology Stack

- **Frontend Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (TailwindCSS)
- **Navigation**: Expo Router
- **State Management**: Context API
- **Maps**: React Native Maps with Google Maps integration
- **UI Components**: Custom shadcn/ui port
- **API Client**: Axios

## 📱 Prerequisites

- Node.js 16+
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Google Maps API Key

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ctrl-hack-del.git
cd ctrl-hack-del/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```env
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

4. Start the development server:
```bash
npx expo start
```

## 📱 Running on Devices

### iOS Simulator
```bash
npx expo run:ios
```

### Android Emulator
```bash
npx expo run:android
```

### Physical Device
1. Install Expo Go on your device
2. Scan the QR code from the terminal
3. The app will load on your device

## 🏗 Project Structure

```
frontend/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── screens/           # Screen components
│   ├── modals/           # Modal components
│   └── ui/               # UI components
├── lib/                   # Utilities and helpers
│   ├── context/          # React Context providers
│   └── utils/            # Helper functions
├── assets/               # Static assets
└── types/                # TypeScript declarations
```

## 🔐 Environment Variables

Required environment variables:

- `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`: Google Places API key for location services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Development Team @ Ctrl-Hack-Del

## 🙏 Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [shadcn/ui](https://ui.shadcn.com/)