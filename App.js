import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import AppleHealthKit from 'react-native-health';

/* Permission options */
const permissions = {
  permissions: {
    read: ['HKQuantityTypeIdentifierStepCount'],
    // write: ['HKQuantityTypeIdentifierStepCount'],
  },
};

AppleHealthKit.initHealthKit(permissions, (error) => {
  /* Called after we receive a response from the system */

  if (error) {
    console.log('[ERROR] Cannot grant permissions!');
  }

  /* Can now read or write to HealthKit */

  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
  };

  AppleHealthKit.getHeartRateSamples(options, (callbackError, results) => {
    /* Samples are now collected from HealthKit */
  });
});

let options = {
  date: new Date().toISOString(), // optional; default now
  includeManuallyAdded: false, // optional: default true
};

let steps;

AppleHealthKit.getStepCount(options, (err, results) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log(results);
  steps = results.value;
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Steps: {steps}</Text>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
