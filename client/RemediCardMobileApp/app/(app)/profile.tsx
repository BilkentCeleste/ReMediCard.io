import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { AtIcon, MailIcon, ChevronRightIcon, EditProfileIcon, SubscriptionIcon, ContactIcon, ProfileIcon, SettingsIcon,
    LanguageIcon, LogoutIcon, HomeIcon } from "@/constants/icons";
import { useAuth } from '@/AuthContext';

export default function Profile() {

    const router = useRouter();
    const { isLoggedIn, logoutAuth } = useAuth();

    const logoutHandler = () => {
        logoutAuth();
        router.push("/login");
    }

    return (
        <View style={styles.container}>
        <Text style={styles.remedicardio}>ReMediCard.io</Text>

        <View style={styles.infoCard}>
            <Text style={styles.infoText}><AtIcon/>Username</Text>
            <Text style={styles.infoText}><MailIcon/>Email</Text>
        </View>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}><EditProfileIcon></EditProfileIcon></View>

            <Text style={styles.menuText}>Edit Profile</Text>
    
            <View style={[styles.chevronRightIcon, styles.iconLayout]}><ChevronRightIcon/></View>
    
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </View>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}><SubscriptionIcon/></View>

            <Text style={styles.menuText}>Subscription</Text>
    
            <View style={[styles.chevronRightIcon, styles.iconLayout]}><ChevronRightIcon></ChevronRightIcon></View>
    
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </View>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}><ContactIcon/></View>

            <Text style={styles.menuText}>Contact Us</Text>
    
            <View style={[styles.chevronRightIcon, styles.iconLayout]}><ChevronRightIcon></ChevronRightIcon></View>
    
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </View>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}><LanguageIcon/></View>

            <Text style={styles.menuText}>Language</Text>
    
            <View style={[styles.chevronRightIcon, styles.iconLayout]}><ChevronRightIcon></ChevronRightIcon></View>
    
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </View>

        <TouchableOpacity style={styles.menuComponent} onPress={logoutHandler}>
            <View style={[styles.menuIcon, styles.iconLayout]}><LogoutIcon/></View>

            <Text style={styles.menuText}>Log Out</Text>
    
            <View style={[styles.chevronRightIcon, styles.iconLayout]}><ChevronRightIcon></ChevronRightIcon></View>
    
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </TouchableOpacity>

        <View style={styles.navbarRow}>
            <TouchableOpacity>
                <Link href="/(app)/home"><HomeIcon/></Link>
            </TouchableOpacity>
            <TouchableOpacity>
                <Link href="/(app)/profile"><ProfileIcon/></Link>
            </TouchableOpacity>
            <TouchableOpacity>
                <SettingsIcon/>
            </TouchableOpacity>
        </View>
                
        <View style={styles.navbarContainer}>
            <View style={styles.navbarLine} />
        </View>

        </View>
    );
}
    
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    remedicardio: {
        fontSize: 30,
        lineHeight: 32,
        fontFamily: "InriaSans-Regular",
        color: "#fff",
        textAlign: "center",
        width: "100%",   
        height: 27,
        marginBottom: 50,
        fontWeight: "bold"
    },
    infoCard:{
        width: "75%",
        flexDirection: "column",
        height: 75,
        justifyContent: "space-evenly",
        marginBottom: 50
    },
    infoText: {
        flex: 1,
        top:5,
        fontSize: 25,
        lineHeight: 25,
        fontFamily: "InriaSans-Regular",
        color: "#fff",
        textAlign: "left",
    },
    menuComponent: {
        width: "75%",
        height: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    menuText: {
        left: 50,
        fontSize: 20,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "left",
        zIndex: 1,
        top: 5,
        position: "absolute"
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    iconLayout: {
        height: 24,
        width: 24,
        position: "absolute"
    },
    chevronRightIcon: {
        left: "95%",
        zIndex: 3,
        top: 5
    },
    menuIcon: {
        right: "95%",
        zIndex: 3,
        top: 5
    },
    navbarRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        marginTop: 30,
        position: "absolute", // Position the navbar absolutely
        bottom: 50,
    },
    navbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "75%",
        position: "absolute",
        bottom: 50,
        backgroundColor: "#53789D", // Match the background color
        height: 1,
    },
    navbarLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
});