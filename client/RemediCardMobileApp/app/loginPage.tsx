import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { LockIcon, MailIcon, GoogleIcon, EyeOpenIcon, EyeClosedIcon } from "../constants/icons";

export default function Login() {

    const [rememberMe, setRememberMe] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = () => {
        
    };

    const handleLoginWithGoogle = () => {
        
    };

    const uploadRegisterPage = () => {
        
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>ReMediCard.io</Text>

        <View style={styles.component}>
            <MailIcon></MailIcon>
            <TextInput style={[styles.usernametext]} placeholder='username' placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
            maxLength={16} 
            value={username}
            onChangeText={setUsername}></TextInput>
        </View>
        
        <View style={styles.component}>
            <LockIcon></LockIcon>
            <TextInput style={styles.passwordtext} placeholder='password' placeholderTextColor={"rgba(0, 0, 0, 0.25)"} 
            maxLength={16}
            secureTextEntry={!passwordVisible} 
            value={password}
            onChangeText={setPassword}></TextInput>
            <TouchableOpacity style={styles.toggleButton} onPress={togglePasswordVisibility}>
                <Text style={styles.toggleText}>
                    {passwordVisible ? (<EyeOpenIcon/>): (<EyeClosedIcon/>)}
                </Text>
            </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logincomponent} onPress={handleLogin}>
            <Text style={styles.logintext}>Log In</Text>
        </TouchableOpacity>
        
        <View style={styles.rememberMeContainer}>
                <Pressable
                    style={styles.checkbox}
                    onPress={toggleRememberMe}
                >
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
                <TouchableOpacity onPress={toggleRememberMe}>
                    <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>
        </View>

        <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.seperatortext}>OR</Text>
                <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity style={styles.component} onPress={handleLoginWithGoogle}>
            <GoogleIcon></GoogleIcon>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
        <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.seperatortext}>Don't have an account? 
                    <Text style={styles.link} onPress={uploadRegisterPage}> Sign Up</Text>
                </Text>
                <View style={styles.separatorLine} />
        </View>
        </View>

        </View>
    );
}

//BUTTON YAZANIN YANINA onPress = {method}
    
const styles = StyleSheet.create({
    icon:{
        left: 0,
    },
    container: {
        height:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    component: {
        height: 50 ,
        borderRadius: 20,
        backgroundColor: "#fff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 30,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 75,
        color: "#ffff",
    },
    input: {
        width: '80%',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    usernametext: {
        top: 5,
        left: 45,
        fontSize: 18,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#111",
        textAlign: "left",
        zIndex: 1,
        position: "absolute"
    },
    passwordtext: {
        top: 5,
        left: 45,
        fontSize: 18,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#111",
        textAlign: "left",
        zIndex: 1,
        position: "absolute"
    },
    logincomponent: {
        height: 50 ,
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        gap: 30,
        marginBottom: 20,
    },
    logintext: {
        fontSize: 17,
        lineHeight: 22,
        fontFamily: "InriaSans-Regular",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 3,
        marginRight: 10,
        backgroundColor: '#53789D',
    },
    checkedBox: {
        backgroundColor: '#fff',
    },
    rememberMeText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: "Inter-Regular",
    },
    checkmark: {
        fontSize: 16,
        color: '#fff',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "75%",
        marginVertical: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    seperatortext: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#fff',
    },
    link: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#2916ff',
    },
    googleButtonText: {
        alignSelf: 'center',
        fontSize: 16,
        color: '#000',
        fontFamily: "Inter-Regular",
    },
    bottomContainer: {
        width: '100%',
        top: 75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButton: {
        marginLeft: 175,
    },
    toggleText: {
        fontSize: 14,
        color: "#2916FF",
    },
});