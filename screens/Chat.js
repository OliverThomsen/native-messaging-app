import React from 'react'
import { Platform, ActivityIndicator, Button, FlatList, KeyboardAvoidingView, Text, TextInput, View, Animated } from 'react-native'
import { getMessages, socket } from '../clientApi'


export default class Chats extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: navigation.getParam('chat').name,
	});

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			messages: [],
			chat: this.props.navigation.getParam('chat'),
			typing: null,
			extraHeight: new Animated.Value(0),
		};
		this.chatID = this.state.chat.id;
	}

	async componentDidMount() {
		try {
			const messages = await getMessages(this.state.chat.id);
			this.setState({
				messages,
				isLoading: false,
			});
		} catch(error) {
			alert(error);
		}
		
		socket.on('typing', this.chatID, (username) => this.setState({typing: username}));
		socket.on('typingEnd', this.chatID, () => this.setState({typing: null}));
		socket.on('message', this.chatID, (message) => {
			this.setState((state) => {
				const messages = state.messages;
				messages.push(message);
				return {messages}
			})
		});
	}

	componentWillUnmount() {
		socket.unsubscribe(this.chatID, 'message');
		socket.unsubscribe(this.chatID, 'typing');
		socket.unsubscribe(this.chatID, 'typingEnd');
	}

	_typing(message) {
		this.message = message;
		socket.sendTyping(this.chatID)
	}

	_sendMessage() {
		if (! this.message || this.message === '') {
			return;
		}
		socket.sendMessage(this.message, this.chatID)
	}
	
	_onKeyboardOpen = () => {
		if (Platform.OS === 'android') {
			Animated.timing(this.state.extraHeight, {
				toValue: 80,
				duration: 300,
			}).start();
		}
	};
	
	_onKeyboardClose = () => {
		if (Platform.OS === 'android') {
			Animated.timing(this.state.extraHeight, {
				toValue:  0,
				duration: 200,
			}).start();
		}
	};
	
	render() {
		const typing = this.state.typing ? <Text>{this.state.typing} typing...</Text> : null;
		
		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20, justifyContent: 'center'}}>
					<ActivityIndicator size="large"/>
				</View>
			)
		}

		return (
			<KeyboardAvoidingView style={styles.container} behavior='padding'>
				<FlatList
					ref={flatList => this.flatList = flatList}
					onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
					style={styles.messages}
					data={this.state.messages}
					keyExtractor={(item) => item.id.toString()}
					extraData={this.state}
					renderItem={({item}) => <Message message={item}/>}
				/>
				{typing}
				<View style={styles.inputContainer}>
					<TextInput placeholder='Message' onChangeText={message => this._typing(message)} style={styles.messageInput} onFocus={this._onKeyboardOpen} onEndEditing={this._onKeyboardClose}/>
					<Button title='send' onPress={() => this._sendMessage()}/>
				</View>
				<Animated.View style={{ height: this.state.extraHeight }} />
			</KeyboardAvoidingView>
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
};
