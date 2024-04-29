import { observer } from 'mobx-react-lite';
import { CSSProperties, useEffect, useMemo } from 'react';
import {
	Handle,
	HandleType,
	Position,
	useUpdateNodeInternals,
} from 'reactflow';
import getHandlePosition from '../utils/getHandlePosition';
import { connectorStyle } from '../utils/blockStyles';

interface Props {
	active: boolean | null;
	type: HandleType;
	id: string;
	position: Position;
	rotation: number;
	nodeId: string;
	styles: CSSProperties;
}

const Connector: React.FC<Props> = observer(
	({ active, type, id, position, rotation, styles, nodeId }) => {
		const updateNodeInternals = useUpdateNodeInternals();

		const { computedStyles, computedPosition } = useMemo(
			() => getHandlePosition(position, rotation, styles),
			[position, rotation, styles]
		);

		useEffect(() => {
			updateNodeInternals(nodeId);
		}, [computedPosition, nodeId, updateNodeInternals]);

		return (
			<Handle
				id={id}
				type={type}
				isConnectableStart={type === 'source'}
				isConnectableEnd={type === 'target'}
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
