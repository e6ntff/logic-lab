import { observer } from 'mobx-react-lite';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
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
				?.map((edge: Edge<any>) => edge.id),
			connectedEdges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[id, connectedEdges]
	);

	const active: boolean | null = useMemo(
		() =>
			prevEdgeIds.length > 0 &&
			prevEdgeIds.every((id: string) => activeEdges[id]),
		// eslint-disable-next-line
		[activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		nextEdgeId && setEdgeActive(nextEdgeId, active || false);
	}, [prevEdgeIds, nextEdgeId, active, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#f00' }}
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
				active={active}
				rotation={rotation}
				nodeId={id}
				maxConnections={Infinity}
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

export default And;
