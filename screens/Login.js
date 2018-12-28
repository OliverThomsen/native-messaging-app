import CustomButton from '../components/CustomButton';
import React from 'react'
import { logIn, signUp } from 'instant-messaging'
import { StyleSheet, TextInput, View, KeyboardAvoidingView, ActivityIndicator } from 'react-native'


export default class Login extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		}
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<TextInput style={styles.textInput} placeholder="Enter username" onChangeText={username => this._username = username}/>
				{this.state.loading ?
					<View>
						<ActivityIndicator/>
					</View>
				:
					<View style={styles.actions}>
						<CustomButton text='Login' type='primary' style={styles.button} onPress={() => this._login()}/>
						<CustomButton text='Sign up' type='secondary' style={styles.button} onPress={() => this._signUp()}/>
					</View>
				}
			</KeyboardAvoidingView>
		);
	}

	_login() {
		this._enableLoadingState();
		logIn(this._username)
			.then(() => this.props.navigation.replace({routeName: 'Chats'}))
			.catch(error => alert(error))
			.finally(this._disableLoadingState.bind(this));

	}

	_signUp() {
		this._enableLoadingState();
		signUp(this._username)
			.then(() => this.props.navigation.replace({routeName: 'Chats'}))
			.catch(error => alert(error))
			.finally(this._disableLoadingState.bind(this));

	}

	_enableLoadingState() {
		this.setState({
			loading: true,
		})
	}

	_disableLoadingState() {
		this.setState({
			loading: false,
		})
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
