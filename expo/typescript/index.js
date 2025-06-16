// This file is used to silence React warnings in development mode
import { LogBox } from 'react-native';

// Silence specific warnings
LogBox.ignoreLogs([
  'Cannot update a component',
  'Warning: Cannot update a component',
  'Warning: Cannot update',
  'setstate-in-render',
  'Hydrate',
  // Add any other warnings you want to ignore
]);

// Override console.error to filter out specific errors
const originalConsoleError = console.error;
console.error = (...args) => {
  // Check if the error message contains any of these strings
  const errorStr = args.join(' ');
  const shouldIgnore = [
    'Cannot update a component',
    'Warning: Cannot update',
    'setstate-in-render',
    'Hydrate',
  ].some(pattern => errorStr.includes(pattern));
  
  // Only log errors that shouldn't be ignored
  if (!shouldIgnore) {
    originalConsoleError(...args);
  }
};

// Use ErrorUtils to catch and handle errors at a lower level
if (global.ErrorUtils) {
  const originalGlobalHandler = global.ErrorUtils.getGlobalHandler();
  
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Check if the error message contains any of the patterns we want to ignore
    const errorMessage = error.message || '';
    const shouldIgnore = [
      'Cannot update a component',
      'Warning: Cannot update',
      'setstate-in-render',
      'Hydrate',
    ].some(pattern => errorMessage.includes(pattern));
    
    // Only pass the error to the original handler if it shouldn't be ignored
    if (!shouldIgnore) {
      originalGlobalHandler(error, isFatal);
    }
  });
}

// Register the main entry point
import 'expo-router/entry';
