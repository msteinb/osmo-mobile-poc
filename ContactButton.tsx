import React from 'react';
import {NativeModules, Button, Alert} from 'react-native';

const {ContactModule} = NativeModules;

const ContactButton = () => {
    const onPress = () => {
        console.log('fetching contacts');

        ContactModule.getContactsByName('John', (contacts: string[]) => {
            Alert.alert('Contact', contacts.join('\n'), [
                {
                    text: 'Ok',
                },
            ]);
        });
    };

    return <Button title="Contacts" onPress={onPress} />;
};

export default ContactButton;
