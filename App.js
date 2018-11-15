import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Login from './screens/Login.js';
import Chats from './screens/Chats.js';
import Chat from './screens/Chat.js';


const RootStack = createStackNavigator(
	{
		Login: Login,
		Chats: Chats,
		Chat: Chat,
	},
	{
		initialRouteName: 'Login',
	}
);


export default class App extends React.Component {

	render() {
		return <RootStack/>
	}
}
