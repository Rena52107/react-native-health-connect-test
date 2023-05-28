import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppleHealthKit from 'react-native-health';
import { NativeEventEmitter, NativeModules } from 'react-native';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.Steps],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
};

AppleHealthKit.initHealthKit(permissions, (error) => {
  /* Called after we receive a response from the system */

  if (error) {
    console.log('[ERROR] Cannot grant permissions!');
  }

  /* Can now read or write to HealthKit */

  let options = {
    startDate: new Date(2016, 1, 1).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
  };

  AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
    if (err) {
      return;
    }
    console.log('getDailyStepCountSamples result: ', results);
  });
});

export default function App() {
  const [authStatus, setAuthStatus] = useState({});

  useEffect(() => {
    new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
      'healthKit:StepCount:new',
      async () => {
        console.log('--> observer triggered');
      }
    );
  }, []);

  const handlePressGetAuthStatus = () => {
    AppleHealthKit.getAuthStatus(permissions, (err, result) => {
      if (err) {
        console.error(err);
      }
      setAuthStatus(result);
    });
  };

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          style={styles.scrollView}
        >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                React Native Health Example
              </Text>
              <Text onPress={handlePressGetAuthStatus}>
                Press me to get Auth Status
              </Text>
              <Text style={styles.sectionDescription}>
                {JSON.stringify(authStatus, null, 2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
