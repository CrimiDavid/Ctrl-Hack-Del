import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Authentication",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'System',
        },
        animation: 'fade',
        presentation: 'transparentModal',
        animationDuration: 200,
        gestureEnabled: false,
      }}
    />
  );
}