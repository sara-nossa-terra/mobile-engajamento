import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@hooks/Auth';

const Dashboard: React.FC = () => {
    const { logOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Dashboard</Text>
            <Button title="Logout" onPress={logOut} />
        </View>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 50,
    },
});
