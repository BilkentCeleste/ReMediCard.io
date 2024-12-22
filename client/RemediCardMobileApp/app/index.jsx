import { View, Text } from 'react-native'
import React from 'react'
import {Redirect, router} from "expo-router";

export default function Index() {
    // Redirect to the sign-in screen
    return <Redirect href="/(app)/home" />;
};