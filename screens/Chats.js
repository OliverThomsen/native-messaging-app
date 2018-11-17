import React from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, Button, View } from 'react-native'
import { getChats } from '../clientApi'

export default class Chats extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: 'Chats',
		headerRight: (
			<Button
				onPress={() => navigation.navigate('CreateChat')}
				title={'New'}
			/>
		)
	})


	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			chats: [],
		}
	}

	componentDidMount() {
		getChats().then(chats => {
			this.setState({
				isLoading: false,
				chats: chats.map(chat => Object.assign(chat, {key: chat.id.toString()})),
			})
		});
	}

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