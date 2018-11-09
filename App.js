import React from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import { login, signUp } from './clientApi.js'

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this._username = '';
	}

	render() {

		console.log(this.state)

		return (
			<View style={styles.container}>
				<TextInput placeholder="Enter username" onChangeText={username => this._username = username}/>
				<View style={styles.actions}>
					<Button title="Login" onPress={() => this._login()}/>
					<Button title="Sign up" onPress={() => this._signUp()}/>
				</View>
			</View>
		);
	}

	_login() {
		login(this._username)
			.then((id) => console.log(id))
			.catch(error => console.log(error))
	}

	_signUp() {
		signUp(this._username)
			.then(id => {
				console.log(id)
				// _open()
			})
			.catch(error => console.log(error))
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
		height: 40,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'center'
	}
});