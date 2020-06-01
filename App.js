import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Login from './screens/Login.js';
import Chats from './screens/Chats.js';
import Chat from './screens/Chat.js';
import CreateChat from './screens/CreateChat.js';


const RootStack = createStackNavigator(
	{
		Login: Login,
		Chats: Chats,
		Chat: Chat,
		CreateChat: CreateChat,
	},
	{
		initialRouteName: 'Login',
	}
);

const App = createAppContainer(RootStack)

export default App;
