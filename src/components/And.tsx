import { observer } from 'mobx-react-lite';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import { blockStyleLarge } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import Connector from './Connector';
import RotationPanel from './NodeUtils';

interface Props {
	id: string;
	data: { rotate: number };
}

const And: React.FC<Props> = observer(({ id }) => {
	const { edges, setEdgeActive, activeEdges, nodes } = appStore;

	const [rotation, setRotation] = useState<number>(0);

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
				?.map((edge: Edge<any>) => edge.id)
				.slice(0, 2),
			connectedEdges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[id, connectedEdges]
	);

	const incoming: [boolean, boolean] = useMemo(
		() => [activeEdges[prevEdgeIds[0]], activeEdges[prevEdgeIds[1]]],
		// eslint-disable-next-line
		[activeEdges[prevEdgeIds[0]], activeEdges[prevEdgeIds[1]], prevEdgeIds]
	);

	const outgoing: boolean | null = useMemo(() => {
		if (incoming === null) return null;
		return incoming[0] && incoming[1];
	}, [incoming]);

	useEffect(() => {
		if (!nextEdgeId) return;
		setEdgeActive(nextEdgeId, outgoing || false);
	}, [prevEdgeIds, nextEdgeId, incoming, outgoing, setEdgeActive]);

	const activeConnectors: { [key: string]: boolean | null } = useMemo(() => {
		const result: { [key: string]: boolean } = {};
		prevEdgeIds.forEach((id: string) => {
			const prevEdge = edges.find((edge: Edge<any>) => edge.id === id);
			if (prevEdge?.targetHandle)
				result[prevEdge.targetHandle] = activeEdges[id];
		});
		return { ...result, c: outgoing };
	}, [prevEdgeIds, activeEdges, edges, outgoing]);

	return (
		<Flex
			style={{ ...blockStyleLarge(rotation), background: '#f00' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#fff', margin: 0 }}>&</Title>
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={activeConnectors.a}
				styles={{
					top: 50,
				}}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='target'
				position={'left' as Position}
				active={activeConnectors.b}
				styles={{
					top: 170,
				}}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='c'
				type='source'
				position={'right' as Position}
				active={activeConnectors.c}
				styles={{
					top: 110,
				}}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default And;
