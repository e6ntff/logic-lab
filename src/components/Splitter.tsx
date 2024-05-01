import { observer } from 'mobx-react-lite';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { useEffect, useMemo } from 'react';
import NodeUtils from './NodeUtils';
import Connector from './Connector';

interface Props {
	id: string;
	data: { rotation: number };
}

const Splitter: React.FC<Props> = observer(({ id, data }) => {
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

	const [prevEdgeId, nextEdgeIds]: [string | undefined, string[]] = useMemo(
		() => [
			connectedEdges.find((edge: Edge<any>) => edge.target === id)?.id,
			connectedEdges
				.filter((edge: Edge<any>) => edge.source === id)
				?.map((edge: Edge<any>) => edge.id),
		],
		[id, connectedEdges]
	);

	const active: boolean | null = useMemo(
		() => prevEdgeId !== undefined && activeEdges[prevEdgeId],
		// eslint-disable-next-line
		[activeEdges, prevEdgeId]
	);

	useEffect(() => {
		nextEdgeIds.forEach((id: string) => {
			setEdgeActive(id, active || false);
		});
	}, [prevEdgeId, nextEdgeIds, active, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<ShareAltOutlined />
			</Title>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
				maxConnections={1}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
				maxConnections={Infinity}
			/>
		</Flex>
	);
});

export default Splitter;
