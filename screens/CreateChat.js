import React from 'react'
import { Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { createChat, searchUsers } from '../clientApi'

export default class CreateChat extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: 'New Chat',
	});

	constructor(props) {
		super(props);
		this.userInput = '';
		this.state = {
			searchList: [],
		};
	}
	
	async componentDidMount() {
		try {
			const searchList = await searchUsers('');
			this.setState({searchList});
		} catch(error) {
			alert(error);
		}
	}
	
	async createNewChat() {
		try {
			const usernames = this.getUsernameArray(this.userInput);
			const chat = await createChat(usernames);
			this.props.navigation.replace({
				routeName: 'Chat',
				params: {chat},
			})	
		} catch(error) {
			alert(error);
		}
	}
	
	async onTyping(rawNames) {
		this.userInput = rawNames;
		await this.getSearchResults(rawNames)
	}
	
	async getSearchResults(rawNames) {
		try {
			const nameArray = rawNames.split(' ');
			const LastName = nameArray[nameArray.length-1];
			const searchList = await searchUsers(LastName);
			this.setState({searchList});	
		} catch(error) {
			alert(error);
		}
	}
	
	addUser(username) {
		const usernames = this.getUsernameArray(this.userInput.replace(/\s?(\w+)$/, ''));
		usernames.push(username);
		
		const inputValue = usernames.reduce((acc, cur) => {
			if (acc === '') return `${cur}, `;
			return `${acc}${cur}, `;
		}, '');
		
		this.userInput = inputValue;
		this.textInput.setNativeProps({text: inputValue});
	}

	getUsernameArray(usernamesString) {
		if (usernamesString.length === 0) return [];
		return usernamesString
			.replace(/,/g, ' ')
			.trim()
			.replace(/ +/g, ' ')
			.split(' ');
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>To: </Text>
				<TextInput 
					ref={textInput => this.textInput = textInput}
					editable={true}
					style={styles.input} 
					onChangeText={names => this.onTyping(names)}/>
				<Button title={'create'} onPress={() => this.createNewChat()}/>
				<FlatList
					data={this.state.searchList}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({item}) => <UserItem user={item} onPressItem={(username) => this.addUser(username)}/>}/>
			</View>
		)
	}
}


class UserItem extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			username: props.user.username,
		}
	}
	
	_onPress() {
		this.props.onPressItem(this.state.username)
	}
	
	render() {
		return (
			<TouchableOpacity onPress={() => this._onPress()}>
				<View>
					<Text>{this.state.username}</Text>
				</View>
			</TouchableOpacity>
		);
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
};

