import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EasterEgg  = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Easter Egg</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default EasterEgg;
