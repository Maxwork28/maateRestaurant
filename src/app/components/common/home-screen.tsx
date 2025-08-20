import { useRouter } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { Button } from 'react-native-paper';
import Blankscreen from './blank-screen';


const Home = () => {
  const router = useRouter();

  const handleContinue = () => {
    console.log('Continue pressed');
    router.push('/(auth)' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <ImageBackground
        source={require('../../../../assets/images/homefood.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.blankContainer}>
          <Blankscreen primaryColor="#FFD700" backgroundColor="none" />
        </View>

        {/* Continue Button at the bottom */}
        <View style={styles.buttonWrapper}>
          <Button
            mode="contained"
            onPress={handleContinue}
            buttonColor="#FF4500"
            contentStyle={styles.buttonContent}
            labelStyle={styles.continueText}
            style={styles.continueButton}
          >
            Continue →
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.5)', // subtle dark overlay for contrast
  },
  blankContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonContent: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Home;
