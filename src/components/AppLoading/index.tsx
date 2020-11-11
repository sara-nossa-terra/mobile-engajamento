import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppLoading: React.FC = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B8EA5" />
    </View>
);

export default AppLoading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
