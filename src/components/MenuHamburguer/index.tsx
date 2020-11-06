import React from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MenuHamburguer: React.FC = () => {
    const navigation = useNavigation();

    const platformIcon = Platform.OS === 'android' ? 'md-menu' : 'ios-menu';

    // @ts-ignore
    const onPress = () => navigation.toggleDrawer();

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name={platformIcon} size={35} color="#fff" />
        </TouchableOpacity>
    );
};

export default MenuHamburguer;

const styles = StyleSheet.create({
    button: {
        marginLeft: 15,
    },
});
