import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getEnvVars() {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return Constants.manifest.extra;
  }
  return process.env;
}

export default getEnvVars();
