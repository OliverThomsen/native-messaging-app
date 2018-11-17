import React from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { createChat } from '../clientApi'

export default class CreateChat extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: 'New Chat',
	})

	constructor(props) {
		super(props);
		this.userNames = [];
	}

	saveNames(names) {
		this.userNames = names.split(' ');
	}


	async onNewChat() {
		const userID = this.userNames.map((id) => parseInt(id))
		const chat = await createChat(userID)
		this.props.navigation.replace({
			routeName: 'Chat',
			params: {chat},
		})
	}


	render() {
		return (
			<View style={styles.container}>
				<Text>To:</Text>
				<TextInput style={styles.input} onChangeText={names => this.saveNames(names)} />
				<Button title={'create'} onPress={() => this.onNewChat()}/>
			</View>
		)
	}
}

const styles = {
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		flex: 1,
	}
}
