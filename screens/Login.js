import CustomButton from '../components/CustomButton';
import React from 'react'
import { logIn, signUp } from '../clientApi'
import { StyleSheet, TextInput, View, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native'


export default class Login extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<TextInput style={styles.textInput} placeholder="Enter username" onChangeText={username => this._username = username}/>
				<View style={styles.actions}>
					<CustomButton text='Login' type='primary' style={styles.button} onPress={() => this._login()}/>
					<CustomButton text='Sign up' type='secondary' style={styles.button} onPress={() => this._signUp()}/>
				</View>
			</KeyboardAvoidingView>
		);
	}

	_login() {
		logIn(this._username)
			.then(() => this.props.navigation.replace({routeName: 'Chats'}))
			.catch(error => alert(error));
	}

	_signUp() {
		signUp(this._username)
			.then(() => this.props.navigation.replace({routeName: 'Chats'}))
			.catch(error => alert(error));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textInput: {
		padding: 8,
		marginBottom: 12,
		fontSize: 16,
	},
	actions: {
		alignItems: 'center',
		minWidth: 150,
	},
	button: {
		marginBottom: 8,
		alignSelf: 'stretch',
	},
	
});
