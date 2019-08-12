import React, { PropTypes } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const TabIcon = ({ focused, iconDefault, iconFocused, tintColor, size }) => {
    return (
        <Icon
            name={iconFocused}
            size={focused ? 25 : 15}
            style={{ color: '#cd2121' }}
        />
    );
};

export default TabIcon;