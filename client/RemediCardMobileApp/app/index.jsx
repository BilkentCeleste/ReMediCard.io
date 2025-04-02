import { View, Text } from 'react-native'
import React from 'react'
import {Redirect, router} from "expo-router";
import './../locales/i18n';

export default function Index() {
    // Redirect to the sign-in screen
    return (
            <Redirect href="/(app)/home" />
    )
};