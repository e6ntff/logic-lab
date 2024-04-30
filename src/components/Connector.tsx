import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import {
	Edge,
	Handle,
	HandleType,
	Position,
	getConnectedEdges,
	useStore,
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
	maxConnections?: number;
}

const selector = (s: any) => ({
	nodeInternals: s.nodeInternals,
	edges: s.edges,
});

const Connector: React.FC<Props> = observer(
	({ active, type, id, position, rotation, nodeId, maxConnections = 1 }) => {
		const updateNodeInternals = useUpdateNodeInternals();

		const computedPosition = useMemo(
			() => getHandlePosition(position, rotation),
			[position, rotation]
		);

		useEffect(() => {
			updateNodeInternals(nodeId);
		}, [computedPosition, nodeId, updateNodeInternals]);

		const { nodeInternals, edges } = useStore(selector);

		const isHandleConnectable = useMemo(() => {
			const node = nodeInternals.get(nodeId);
			const connectedEdges = getConnectedEdges([node], edges).filter(
				(edge: Edge<any>) => edge[type] === nodeId
			);
			return connectedEdges.length < maxConnections;
		}, [nodeInternals, edges, nodeId, maxConnections, type]);

		return (
			<Handle
				id={id}
				type={type}
				position={computedPosition}
				style={{
					...connectorStyle,
					background: active ? '#f00' : '#000',
				}}
				isConnectable={isHandleConnectable}
			/>
		);
	}
);

export default Connector;
