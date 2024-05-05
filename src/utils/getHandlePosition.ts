import { Position } from 'reactflow';

const getHandlePosition = (
	position: Position,
	rotation: number | undefined
) => {
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
	return position;
};

export default getHandlePosition;
