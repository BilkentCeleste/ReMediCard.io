import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Switch as RNSwitch } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from "react-i18next";
import { useColorScheme } from 'nativewind';

export default function SettingsScreen() {
  const { isLoggedIn, logoutAuth } = useAuth();
  const { t } = useTranslation("settings");
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  const handleLogout = () => {
    logoutAuth();
    router.push("/login");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.heading}>{t("settings") || "Settings"}</ThemedText>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>{t("appearance") || "Appearance"}</ThemedText>
          <View style={styles.row}>
            <ThemedText>{t("dark_mode") || "Dark Mode"}</ThemedText>
            <RNSwitch value={isDark} onValueChange={toggleColorScheme} />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>{t("notifications") || "Notifications"}</ThemedText>
          <View style={styles.row}>
            <ThemedText>{t("study_reminders") || "Study Reminders"}</ThemedText>
            <RNSwitch value={true} />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>{t("about") || "About"}</ThemedText>
          <ThemedText>App Version: 1.0.0</ThemedText>
          <TouchableOpacity onPress={() => router.push("/(app)/(profile)/contactus")}>
            <ThemedText type="link" style={styles.link}>{t("contact_support") || "Contact Support"}</ThemedText>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>{t("log_out") || "Log Out"}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  heading: {
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  link: {
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#C8102E',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
}); 