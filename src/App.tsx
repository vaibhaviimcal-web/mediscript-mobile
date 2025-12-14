import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import {AppProvider} from './context/AppContext';
import {theme} from './constants/theme';
import {initializeDatabase} from './services/database/DatabaseService';
import {initializeNotifications} from './services/notifications/NotificationService';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  useEffect(() => {
    // Initialize app services
    const initializeApp = async () => {
      try {
        // Initialize SQLite database
        await initializeDatabase();
        console.log('✅ Database initialized');

        // Initialize push notifications
        await initializeNotifications();
        console.log('✅ Notifications initialized');
      } catch (error) {
        console.error('❌ App initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AppProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={theme.colors.primary}
            />
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AppProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
