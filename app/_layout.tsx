import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import FirstPasswordCreation from "@/app/FirstPasswordCreation";
import PreviewPDF from "@/app/PreviewPDF";
import PreviewCamera from "@/app/PreviewCamera";
import ReportViewer from "@/app/reportViewer";
import ShareReport from "@/app/ShareReport";
import MoreDetails from "@/app/MoreDetails";
import CreateNewPassword from "@/app/CreateNewPassword";
import ForgetPassword from "@/app/forgetpassword";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  // const username = await AsyncStorage.getItem('userName');
  //       if (username) {
  //           router.push('/Dashboard');
  //       } else {
  //           router.push('/Welcome');
  //       }
  initialRouteName: 'Dashboard',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="Dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" options={{ headerShown: false }} />
        <Stack.Screen name="TermsandConditions" options={{title:'Terms And Conditions' }} />
        <Stack.Screen name="FirstPasswordCreation" options={{title:'Create Your Password' }} />
        <Stack.Screen name="PreviewPDF" options={{title:'Preview PDF' }} />
        <Stack.Screen name="PreviewCamera" options={{title:'Preview' }} />
        <Stack.Screen name="reportViewer" options={{title:'View Report' }} />
        <Stack.Screen name="ShareReport" options={{title:'Share Report' }} />
        <Stack.Screen name="MoreDetails" options={{title:'Kin Details' }} />
        <Stack.Screen name="CreateNewPassword" options={{title:'Create New Password' }} />
        <Stack.Screen name="forgetpassword" options={{title:'Forgot Password' }} />
      </Stack>
    </ThemeProvider>
  );
}
