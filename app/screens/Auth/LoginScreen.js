import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim() === '') return;
    navigation.replace('ChatList', { username: name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to WhatsApp Clone</Text>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 20 },
  input: { borderWidth: 1, width: '80%', padding: 10, borderRadius: 8 },
  button: { backgroundColor: '#25D366', marginTop: 20, padding: 10, borderRadius: 8 },
  buttonText: { color: '#fff' }
});
