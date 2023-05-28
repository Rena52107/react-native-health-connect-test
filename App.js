import React, { useState, useEffect, useReducer } from 'react';
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

const stepCountReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP_COUNT':
      return action.payload;
    default:
      return state;
  }
};

export default function App() {
  const [authStatus, setAuthStatus] = useState({});
  const [stepCount, dispatch] = useReducer(stepCountReducer, 0);

  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }

      let options = {
        startDate: new Date(2016, 1, 1).toISOString(),
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
        if (err) {
          return;
        }
        console.log('getDailyStepCountSamples result: ', results);

        const totalSteps = results.reduce((total, sample) => total + sample.value, 0);
        dispatch({ type: 'SET_STEP_COUNT', payload: totalSteps });
      });
    });

    const eventEmitter = new NativeEventEmitter(NativeModules.AppleHealthKit);
    eventEmitter.addListener('healthKit:StepCount:new', () => {
      console.log('--> observer triggered');
    });

    return () => {
      eventEmitter.removeAllListeners('healthKit:StepCount:new');
    };
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
              <Text style={styles.sectionDescription}>
                Step Count: {stepCount}
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
