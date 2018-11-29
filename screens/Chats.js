import CustomButton from '../components/CustomButton';
import React from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, Button, View } from 'react-native'
import { getChats, logOut } from '../clientApi'
import { NavigationActions } from 'react-navigation'

export default class Chats extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: 'Chats',
		headerRight: (<CustomButton text='New' type='secondary' onPress={() => navigation.navigate('CreateChat')}/>),
		headerLeft: (
			<CustomButton text='Log out' type='secondary' onPress={() => {
				logOut();
				navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0)
			}}/>
		),
	});
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			chats: [],
		};
		this.props.navigation.addListener('willFocus', this.updateChats);
	}
	
	updateChats = async () => {
		try {
			const chats = await getChats();
			this.setState({
				isLoading: false,
				chats: chats.map(chat => Object.assign(chat, {key: chat.id.toString()})),
			});
		} catch(error) {
			alert(error);
		}
	};

	render() {
		if (this.state.isLoading) {
			return (
				<View style={{flex: 1, padding: 20}}>
					<ActivityIndicator/>
				</View>
			)
		}

		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.chats}
					renderItem={({item}) => {
						return (
							<TouchableOpacity onPress={() => this.openChat(item)}>
								<View style={styles.listItem}>
									<Text style={styles.chatName}>{item.name ? item.name : item.users[0].user.username}</Text>
									<Text style={styles.message}>{item.lastMessage ? item.lastMessage.content : ''}</Text>
								</View>
							</TouchableOpacity>
						)
					}}
				/>
			</View>
		);
	}

	openChat(chat) {
		this.props.navigation.navigate('Chat', {chat})
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	listItem: {
		paddingLeft: 8,
		paddingTop: 4,
		paddingRight: 8,
		paddingBottom: 4,
	},
	chatName: {
		fontSize: 16,
	},
	message: {
		fontSize: 14,
		color: 'grey',	
	},
};
