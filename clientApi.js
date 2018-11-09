const root = 'http://localhost:3000/api';
const headers =  {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

let _username;
let _userID;

export function login(username) {
	return fetch(root + '/login', {
		method: 'POST',
		headers,
		body: JSON.stringify({username}),
	})
		.then(res => res.json())
		.then(res => {
			_username = username;
			_userID = res.id;
			return res.id;
		});
}


export function signUp(username) {
	return fetch(root + '/users', {
		method: 'POST',
		headers,
		body: JSON.stringify({username}),
	})
		.then(res => res.json())
		.then(res => {
			_username = username;
			_userID = res.id;
			return res.id;
		})
}