import React from 'react'
import { ActivityIndicator, Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { getMessages, socket } from '../clientApi'


export default class Chats extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: navigation.getParam('chat').name,
	})


	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			messages: [],
			chat: this.props.navigation.getParam('chat')
		}
	}

	async componentDidMount() {
		getMessages(this.state.chat.id).then(messages => {
			this.setState({
				messages,
				isLoading: false,
			})
		});
		socket.on('message', this.state.chat.id, (message) => {
			this.setState((state) => {
				const messages = state.messages;
				messages.push(message)
				return {messages}
			})
		});
	}

	componentWillUnmount() {
		socket.unsubscribe(this.state.chat.id, 'message')
	}

	_typing(message) {
		this.message = message;
		socket.sendTyping(this.state.chat.id)
	}

	_sendMessage() {
		if (! this.message || this.message === '') {
			return;
		}
		socket.sendMessage(this.message, this.state.chat.id)
	}

	render() {
		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20, justifyContent: 'center'}}>
					<ActivityIndicator size="large"/>
				</View>
			)
		}

		return (
			<View style={styles.container}>
				<FlatList
					ref={flatList => this.flatList = flatList}
					onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
					style={styles.messages}
					data={this.state.messages}
					keyExtractor={(item) => item.id.toString()}
					extraData={this.state}
					renderItem={({item}) => <Message message={item}/>}
				/>
				<View style={styles.inputContainer}>
					<TextInput placeholder={'Message'} onChangeText={message => this._typing(message)} style={styles.messageInput}/>
					<Button title={'send'} onPress={() => this._sendMessage()}/>
				</View>
			</View>
		)
	}
}


class Message extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			content: props.message.content,
		}
	}

	render() {
		return (
			<View style={styles.messageItem}>
				<Text>{this.state.content}</Text>
			</View>
		);
	}
}


const styles = {
	container: {
		flex: 1,
	},
	messages: {
		flex: 1,
		padding: 12,
	},
	messageItem: {
		marginBottom: 8,
		borderRadius: 16,
		padding: 6,
		paddingLeft: 12,
		paddingRight: 12,
		maxWidth: 250,
		backgroundColor: 'lightgray',
	},
	inputContainer: {
		padding: 12,
		flex: 0,
		flexDirection: 'row',
	},
	messageInput: {
		flex: 1,
		padding: 6,
		paddingLeft: 12,
		paddingRight: 12,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'grey',
	}
}