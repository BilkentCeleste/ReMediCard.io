import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { LOGIN_URL } from '../constants/config.js';

export default function Login() {
    const router = useRouter();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');

    const handleLogin = async () => {
        console.log("login");
        const user_info = {"username": username, "email": email, "password": password}

        // put your ip here
        const ip = LOGIN_URL;

        axios.post(ip, user_info).then((response) => {
            console.log(response.data);
        }).catch((error) => {console.log(error)});
        
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>asd</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
        <Button title="Login"  onPress={handleLogin}/>
        </View>
    );
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});