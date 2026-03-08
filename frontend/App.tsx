import { StatusBar } from 'expo-status-bar';
import { MenuProvider } from 'react-native-popup-menu';
import './global.css';
import RootNavigator from 'navigation/RootNavigator';
import { AuthProvider } from 'context/AuthContext';

export default function App() {
  return (
    <MenuProvider>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </MenuProvider>
  );
}
