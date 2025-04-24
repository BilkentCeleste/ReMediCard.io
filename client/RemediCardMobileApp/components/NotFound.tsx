import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { HomeIcon, ProfileIcon, SettingsIcon } from '@/constants/icons';

interface NotFoundPageProps {
    message: string;
}

const NotFound: React.FC<NotFoundPageProps> = ({ message }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Oops, something went wrong</Text>
            </View>

            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{message}</Text>
            </View>

            <View style={styles.navbarRow}>
                <TouchableOpacity>
                    <Link href="/(app)/home"><HomeIcon /></Link>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Link href="/(app)/profile"><ProfileIcon /></Link>
                </TouchableOpacity>
                <TouchableOpacity>
                    <SettingsIcon />
                </TouchableOpacity>
            </View>
            <View style={styles.navbarContainer}>
                <View style={styles.navbarLine} />
            </View>
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
    navbarRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#53789D',
    },
    navbarContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "75%",
        position: "absolute",
        bottom: 50,
        backgroundColor: "#53789D",
        height: 1,
    },
    navbarLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#fff",
    },
});

export default NotFound;
