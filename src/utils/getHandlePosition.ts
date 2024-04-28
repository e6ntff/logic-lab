import { CSSProperties } from 'react';
import { Position } from 'reactflow';

const getHandlePosition = (
	position: Position,
	rotation: number,
	styles: CSSProperties
) => {
	const { top, left, bottom, right } = styles;
	switch (rotation) {
		case 90: {
			styles = {
				...styles,
				top: left,
				left: bottom,
				bottom: right,
				right: top,
			};
			break;
		}
		case 180: {
			styles = {
				...styles,
				top: bottom,
				left: right,
				bottom: top,
				right: left,
			};
			break;
		}
		case 270: {
			styles = {
				...styles,
				top: right,
				left: top,
				bottom: left,
				right: bottom,
			};
			break;
		}
		default:
			break;
	}
	switch (position) {
		case 'top':
			if (rotation === 90) {
				position = 'right' as Position;
			} else if (rotation === 180) {
				position = 'bottom' as Position;
			} else if (rotation === 270) {
				position = 'left' as Position;
			}
			break;
		case 'right':
			if (rotation === 90) {
				position = 'bottom' as Position;
			} else if (rotation === 180) {
				position = 'left' as Position;
			} else if (rotation === 270) {
				position = 'top' as Position;
			}
			break;
		case 'bottom':
			if (rotation === 90) {
				position = 'left' as Position;
			} else if (rotation === 180) {
				position = 'top' as Position;
			} else if (rotation === 270) {
				position = 'right' as Position;
			}
			break;
		case 'left':
			if (rotation === 90) {
				position = 'top' as Position;
			} else if (rotation === 180) {
				position = 'right' as Position;
			} else if (rotation === 270) {
				position = 'bottom' as Position;
			}
			break;
	}
	return { computedStyles: styles, computedPosition: position };
};

export default getHandlePosition;
