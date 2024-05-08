import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import {
	Edge,
	Handle,
	HandleType,
	Position,
	useUpdateNodeInternals,
} from 'reactflow';
import getHandlePosition from '../utils/getHandlePosition';
import { connectorStyle } from '../utils/blockStyles';
import { Flex, Typography } from 'antd';
import appStore from '../utils/appStore';
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	active: boolean | null;
	type: HandleType;
	id: string;
	position: Position;
	nodeId: string;
	maxConnections?: number;
}

const Connector: React.FC<Props> = observer(
	({ active, type, id, position, nodeId, maxConnections = 1 }) => {
		const updateNodeInternals = useUpdateNodeInternals();

		const { nodesData, connections } = appStore;

		const { rotation } = useMemo(
			() => GetNodeParameters(nodeId),
			// eslint-disable-next-line
			[nodesData[nodeId]]
		);

		const computedPosition = useMemo(
			() => getHandlePosition(position, rotation),
			[position, rotation]
		);

		useEffect(() => {
			updateNodeInternals(nodeId);
			return () => updateNodeInternals(nodeId);
		}, [computedPosition, nodeId, updateNodeInternals]);

		const connectedEdges = useMemo(() => {
			let prev: Edge<any>[] = [];
			let next: Edge<any>[] = [];
			try {
				prev = Object.values(connections[nodeId]?.prev);
			} catch (error) {}

			try {
				next = Object.values(connections[nodeId]?.next);
			} catch (error) {}
			return [...prev, ...next].filter((edge: Edge<any>) => {
				return edge[type] === nodeId;
			});
		}, [nodeId, connections, type]);

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
