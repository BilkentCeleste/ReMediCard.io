import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { HomeIcon, ProfileIcon, SettingsIcon } from '@/constants/icons';
import NavBar from './NavBar';

interface NotFoundPageProps {
    title: string;
    message: string;
}

const NotFound: React.FC<NotFoundPageProps> = ({ title, message }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
            </View>

            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{message}</Text>
            </View>

            <NavBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    titleContainer: {
        marginBottom: 20,
    },
    titleText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    messageContainer: {
        width: '75%',
        padding: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    messageText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    buttonContainer: {
        marginBottom: 50,
    },
});

export default NotFound;
