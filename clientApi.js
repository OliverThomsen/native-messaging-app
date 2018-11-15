import SocketIOClient from 'socket.io-client'

const root = 'http://localhost:3000';
const rootApi = `${root}/api`;
const headers =  {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

let _username;
let _userID;
let _socket;


export function login(username) {
	return fetch(`${rootApi}/login`, {
		method: 'POST',
		headers,
		body: JSON.stringify({username}),
	})
		.then(res => res.json())
		.then(res => {
			_username = username;
			_userID = res.id;
			_openSocket();
			return res.id;
		});
}


export function signUp(username) {
	return fetch(`${rootApi}/users`, {
		method: 'POST',
		headers,
		body: JSON.stringify({username}),
	})
		.then(res => res.json())
		.then(res => {
			_username = username;
			_userID = res.id;
			_openSocket();
			return res.id;
		})
}


export async function getChats() {
	const chats = await fetch(`${rootApi}/users/${_userID}/chats`).then(res => res.json())
	return chats;
}

export async function getMessages(chatID) {
	const messages = await fetch(`${rootApi}/chats/${chatID}/messages`).then(res => res.json())
	return messages;
}

function _openSocket() {
	_socket = SocketIOClient(root, {
		query: {
			userID: _userID,
		},
	})

	_socket.on('message', (message) => {
		const chatID = message.chat.id
		socket._emit('message', chatID, message)
	})

	_socket.on('_typing', (data) => {
		socket._emit('_typing', data.chatID, data.username);
	})
}

export let socket = {
	events: {
		typing: [],
		message: [],
	},

	sendMessage(content, chatID) {
		_socket.emit('message', { content, chatID })
	},

	sendTyping(chatID) {
		_socket.emit('_typing', { chatID })
	},

	on(event, chatID, callback) {
		if (! this.events[event]) return;
		this.events[event].push({chatID, callback});
	},

	unsubscribe(chatID, event) {
		if (! this.events[event]) return;
		this.events[event] = this.events[event].filter(obj => obj.chatID !== chatID);
	},

	_emit(event, chatID, data) {
		this.events[event].forEach(obj => {
			if (obj.chatID === chatID) {
				obj.callback(data)
			}
		});
	},


}