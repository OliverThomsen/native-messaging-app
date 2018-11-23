import React from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, Button, View } from 'react-native'
import { getChats, logOut } from '../clientApi'
import { NavigationActions } from 'react-navigation'

export default class Chats extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: 'Chats',
		headerRight: (<Button title={'New'} onPress={() => navigation.navigate('CreateChat')}/>),
		headerLeft: (
			<Button title={'Log out'} onPress={() => {
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
			<View>
				<FlatList
					data={this.state.chats}
					renderItem={({item}) => {
						return (
							<TouchableOpacity onPress={() => this.openChat(item)}>
								<View>
									<Text>{item.name ? item.name : item.users[0].user.username}</Text>
									<Text>{item.lastMessage ? item.lastMessage.content : ''}</Text>
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
