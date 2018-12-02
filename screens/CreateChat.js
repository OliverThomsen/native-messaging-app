import CustomButton from '../components/CustomButton';
import React from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
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
			<View style={styles.view}>
				<View style={styles.inputContainer}>
					<Text style={styles.to}>To:</Text>
					<TextInput
						ref={textInput => this.textInput = textInput}
						autoFocus={true}
						editable={true}
						style={styles.input}
						onChangeText={names => this.onTyping(names)}/>
					<CustomButton text='Create' type='secondary' onPress={() => this.createNewChat()}/>
				</View>
				<FlatList
					style={styles.list}
					data={this.state.searchList}
					keyboardShouldPersistTaps='always'
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
			<TouchableOpacity style={styles.listItem} onPress={() => this._onPress()}>
				<View>
					<Text style={{fontSize: 16}}>{this.state.username}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}


const styles = {
	view: {
		flex: 1,
		backgroundColor: 'white',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f9f9f9',
		padding: 12,
	},
	to: {
		marginRight: 8,
		fontSize: 16,
		color: 'grey',
	},
	input: {
		flex: 1,
		fontSize: 16,
	},
	list: {
		paddingLeft: 12,
	},
	listItem: {
		paddingTop: 12,
		paddingBottom: 12,
		fontSize: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'lightgrey'
	},
};

