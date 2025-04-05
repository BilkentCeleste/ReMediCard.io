import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from "expo-router";
import './../locales/i18n';
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
    const { isLoggedIn } = useAuth();
    
    // Redirect to login if not logged in, otherwise to tabs
    return isLoggedIn ? (
        <Redirect href="/(app)/(tabs)" />
    ) : (
        <Redirect href="/login" />
    );
};