import SocketIOClient from 'socket.io-client'

const _root = 'http://localhost:3000';
const _rootApi = `${_root}/api`;
const _headers =  {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

let _io;
let _username;
let _userID;
let _events = {
	typing: [],
	message: [],
}


function _openSocket() {
	_io = SocketIOClient(_root, {
		query: {
			userID: _userID,
		},
	})

	_io.on('message', (message) => {
		const chatID = message.chat.id
		_emit('message', chatID, message)
	})

	_io.on('typing', (data) => {
		_emit('typing', data.chatID, data.username);
	})
}


function _emit(event, chatID, data) {
	_events[event].forEach(obj => {
		if (obj.chatID === chatID) {
			obj.callback(data)
		}
	});
}


export let socket = {
	sendMessage(content, chatID) {
		_io.emit('message', { content, chatID })
	},

	sendTyping(chatID) {
		_io.emit('typing', { chatID })
	},

	on(event, chatID, callback) {
		if (! _events[event]) return;
		_events[event].push({chatID, callback});
	},

	unsubscribe(chatID, event) {
		if (! _events[event]) return;
		_events[event] = _events[event].filter(obj => obj.chatID !== chatID);
	},
}


export function login(username) {
	return fetch(`${_rootApi}/login`, {
		method: 'POST',
		headers: _headers,
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


export function logOut() {
	_io.disconnect();
	_events.message = [];
	_events.typing = [];
	_username = undefined;
	_userID = undefined;
}


export function signUp(username) {
	return fetch(`${_rootApi}/users`, {
		method: 'POST',
		headers: _headers,
		body: JSON.stringify({username}),
	})
		.then(res => res.json())
		.then(res => {
			_username = username;
			_userID = res.id;
			_openSocket();
		})
}


export async function getChats() {
	return await fetch(`${_rootApi}/users/${_userID}/chats`)
		.then(res => res.json())
}


export async function getMessages(chatID) {
	return await fetch(`${_rootApi}/chats/${chatID}/messages`)
		.then(res => res.json())
}

export async function createChat(users) {
	users.push(_userID)
	return await fetch(`${_rootApi}/chats`,{
		method: 'POST',
		headers: _headers,
		body: JSON.stringify({
			userID: _userID,
			users
		}),
	}).then(res => res.json())
}