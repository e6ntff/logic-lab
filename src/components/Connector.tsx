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
import { NodeData } from '../utils/interfaces';
import appStore from '../utils/appStore';

interface Props {
	active: boolean;
	type: HandleType;
	id: string;
	position: Position;
	nodeId: string;
	rotation: NodeData['rotation'];
	maxConnections?: number;
}

const Connector: React.FC<Props> = observer(
	({ active, type, id, position, nodeId, rotation, maxConnections = 1 }) => {
		const { edges } = appStore;

		const updateNodeInternals = useUpdateNodeInternals();

		const computedPosition = useMemo(
			() => getHandlePosition(position, rotation),
			[position, rotation]
		);

		useEffect(() => {
			updateNodeInternals(nodeId);

			return () => updateNodeInternals(nodeId);
		}, [computedPosition, nodeId, updateNodeInternals]);

		const connectedEdges = useMemo(() => {
			return edges.filter((edge: Edge<any>) => {
				return edge[type] === nodeId;
			});
		}, [type, nodeId, edges]);

		const isHandleConnectable = useMemo(() => {
			return connectedEdges.length < maxConnections;
		}, [connectedEdges, maxConnections]);

		const text = useMemo(() => {
			if (maxConnections === Infinity) return '∞';
			return `${connectedEdges.length}/${maxConnections}`;
		}, [maxConnections, connectedEdges]);

		return (
			<Handle
				className='noDrag'
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
