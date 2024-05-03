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
import { Flex, Typography } from 'antd';

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

		const node = useMemo(
			() => nodeInternals.get(nodeId),
			[nodeInternals, nodeId]
		);

		const connectedEdges = useMemo(
			() =>
				getConnectedEdges([node], edges).filter(
					(edge: Edge<any>) => edge[type] === nodeId
				),
			[edges, node, type, nodeId]
		);

		const isHandleConnectable = useMemo(() => {
			return connectedEdges.length < maxConnections;
		}, [connectedEdges, maxConnections]);

		const text = useMemo(() => {
			if (maxConnections === Infinity) return '∞';
			return `${connectedEdges.length}/${maxConnections}`;
		}, [maxConnections, connectedEdges]);

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
			>
				<Flex
					style={{
						position: 'absolute',
						inset: 0,
						inlineSize: '100%',
						blockSize: '100%',
						pointerEvents: 'none',
					}}
					justify='center'
					align='center'
				>
					<Typography.Text style={{ color: '#fff' }}>{text}</Typography.Text>
				</Flex>
			</Handle>
		);
	}
);

export default Connector;
