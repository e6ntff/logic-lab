import { CSSProperties } from 'react';

export const connectorStyle: CSSProperties = {
	blockSize: 20,
	inlineSize: 25,
	borderRadius: 3,
	border: 0,
	boxShadow: 'none',
	background: '#000',
};

export const blockStyleLarge: (rotation: number) => CSSProperties = (
	rotation: number
) => {
	const horizontal = rotation === 90 || rotation === 270;
	return {
		border: '5px solid #000',
		borderRadius: 10,
		padding: 10,
		width: horizontal ? 190 : 70,
		height: horizontal ? 70 : 190,
	};
};

export const blockStyleSmall: CSSProperties = {
	background: '#fff',
	border: '5px solid #000',
	borderRadius: 10,
	padding: 10,
	width: 70,
	height: 70,
};
