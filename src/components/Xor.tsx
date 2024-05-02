import { observer } from 'mobx-react-lite';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from './Connector';
import NodeUtils from './NodeUtils';

interface Props {
	id: string;
	data: { rotation: number };
}

const Xor: React.FC<Props> = observer(({ id, data }) => {
	const { edges, setEdgeActive, activeEdges, nodes } = appStore;

	const { rotation } = data;

	const node = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const [prevEdgeIds, nextEdgeId]: [string[], string | undefined] = useMemo(
		() => [
			connectedEdges
				.filter((edge: Edge<any>) => edge.target === id)
				?.map((edge: Edge<any>) => edge.id),
			connectedEdges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[id, connectedEdges]
	);

	const active: boolean | null = useMemo(() => {
		if (prevEdgeIds.length !== 2) return null;
		const [first, second] = [
			activeEdges[prevEdgeIds[0]],
			activeEdges[prevEdgeIds[1]],
		];
		return (!first && second) || (first && !second);
	}, [activeEdges, prevEdgeIds]);

	useEffect(() => {
		if (!nextEdgeId) return;
		setEdgeActive(nextEdgeId, active || false);
	}, [prevEdgeIds, nextEdgeId, active, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>⊕</Title>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
				maxConnections={2}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Xor;
