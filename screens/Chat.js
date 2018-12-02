import CustomButton from '../components/CustomButton';
import React from 'react'
import { Platform, ActivityIndicator, FlatList, KeyboardAvoidingView, Text, TextInput, View, Animated } from 'react-native'
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
		this.textInput.clear();
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
		const typing = this.state.typing ? <Text style={styles.typing}>{this.state.typing} is typing...</Text> : null;
		
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
					renderItem={({item}) => <Message message={item} isGroupMessage={this.state.chat.users.length > 2}/>}
				/>
				{typing}
				<View style={styles.inputContainer}>
					<TextInput placeholder='Message'
					           ref={textInput => this.textInput = textInput}
					           style={styles.messageInput}
					           multiline={true}
					           onChangeText={message => this._typing(message)}
					           onFocus={this._onKeyboardOpen}
					           onEndEditing={this._onKeyboardClose}/>
					<CustomButton text='send' type='secondary' onPress={() => this._sendMessage()}/>
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
		const direction = this.props.message.direction;
		
		return (
			<View>
				{ direction === 'rx' && this.props.isGroupMessage && <Text style={styles.senderName}>{this.props.message.user.username}</Text> }
				<View style={[styles.messageItem, direction === 'rx' ? styles.messageItemRx : styles.messageItemTx]}>
					<Text style={direction === 'rx' ? styles.textRx : styles.textTx}>{this.state.content}</Text>
				</View>
			</View>
		);
	}
}


const styles = {
	container: {
		flex: 1,
		backgroundColor: 'white',
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
	messageItemTx: {
		alignSelf: 'flex-end',
		backgroundColor: 'black',
	},
	messageItemRx: {
		alignSelf: 'flex-start',
		backgroundColor: '#f1f0f0',
	},
	textTx: {
		fontSize: 16,
		color: '#f1f0f0',
	},
	textRx: {
		fontSize: 16,
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
		maxHeight: 150,
		fontSize: 16,
	},
	senderName: {
		marginLeft: 6,
		marginBottom: 4,
		fontSize: 12,
		color: 'grey',
	},
	typing: {
		paddingLeft: 12,
	},
};
