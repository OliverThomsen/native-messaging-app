import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default class CustomButton extends React.Component {
	
	constructor (props) {
		super(props);
		this.text = props.text;
		this.extraStyle = props.style;
		this.type = this.props.type;
		this.onPress = props.onPress;
		
	}
	
	render() {
		const isSecondary = this.type === 'secondary';
		return (
			<TouchableOpacity onPress={this.onPress} style={[styles.buttonWrapper, (isSecondary && styles.buttonWrapperSecondary), this.extraStyle]}>
				<Text style={isSecondary ? styles.buttonTextSecondary : styles.buttonText}>{this.text}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = {
	buttonWrapper: {
		padding: 8,
		backgroundColor: 'black',
		borderRadius: 18,
	},
	buttonWrapperSecondary: {
		backgroundColor: 'transparent',
	},
	buttonText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 16,
	},
	buttonTextSecondary: {
		fontSize: 16,
		textAlign: 'center',
		color: '#007aff',
	},
};
