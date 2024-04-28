import { CSSProperties } from 'react';
import { Position } from 'reactflow';

const getHandlePosition = (
	position: Position,
	rotation: number,
	styles: CSSProperties
) => {
	const { top, left } = styles;

	switch (rotation) {
		case 90: {
			if (typeof top === 'string' || !top) break;
			styles = {
				...styles,
				left: top,
				top: left,
			};
			break;
		}
		case 270: {
			if (typeof top === 'string') break;
			styles = {
				...styles,
				left: top,
				top: left,
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
