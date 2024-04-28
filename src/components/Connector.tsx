import { observer } from 'mobx-react-lite';
import { CSSProperties, useMemo } from 'react';
import { Handle, HandleType, Position } from 'reactflow';
import getHandlePosition from '../utils/getHandlePosition';
import { connectorStyle } from '../utils/blockStyles';

interface Props {
	active: boolean | null;
	type: HandleType;
	id: string;
	position: Position;
	rotation: number;
	styles: CSSProperties;
}

const Connector: React.FC<Props> = observer(
	({ active, type, id, position, rotation, styles }) => {
		const { computedStyles, computedPosition } = useMemo(
			() => getHandlePosition(position, rotation, styles),
			[position, rotation, styles]
		);

		return (
			<Handle
				id={id}
				type={type}
				position={computedPosition}
				style={{
					...computedStyles,
					...connectorStyle,
					background: active ? '#f00' : '#000',
				}}
			/>
		);
	}
);

export default Connector;
