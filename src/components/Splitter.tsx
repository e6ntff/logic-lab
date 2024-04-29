import { observer } from 'mobx-react-lite';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import { blockStyleSmall } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import RotationPanel from './NodeUtils';
import Connector from './Connector';

interface Props {
	id: string;
	data: { rotate: number };
}

const Splitter: React.FC<Props> = observer(({ id }) => {
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

	const [prevEdgeId, nextEdgeIds]: [string | undefined, string[]] = useMemo(
		() => [
			connectedEdges.find((edge: Edge<any>) => edge.target === id)?.id,
			connectedEdges
				.filter((edge: Edge<any>) => edge.source === id)
				?.map((edge: Edge<any>) => edge.id)
				.slice(0, 2),
		],
		[connectedEdges, id]
	);

	const incoming: boolean | null = useMemo(
		() => {
			if (!prevEdgeId) return null;
			return activeEdges[prevEdgeId];
		},
		// eslint-disable-next-line
		[activeEdges[prevEdgeId as string], prevEdgeId]
	);

	useEffect(() => {
		nextEdgeIds.forEach((id: string) => {
			setEdgeActive(id, incoming || false);
		});
	}, [nextEdgeIds, incoming, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyleSmall, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<ShareAltOutlined />
			</Title>
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
				styles={{
					top: 50,
				}}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={incoming}
				styles={{
					top: 50,
				}}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Splitter;
