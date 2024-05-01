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

const Not: React.FC<Props> = observer(({ id, data }) => {
	const { edges, activeEdges, setEdgeActive, nodes } = appStore;

	const { rotation } = data;

	const node = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const [prevEdgeId, nextEdgeId]: (string | undefined)[] = useMemo(
		() => [
			connectedEdges.find((edge: Edge<any>) => edge.target === id)?.id,
			connectedEdges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[connectedEdges, id]
	);

	const active: boolean | null = useMemo(
		() => (prevEdgeId ? !activeEdges[prevEdgeId] : null),
		// eslint-disable-next-line
		[activeEdges, prevEdgeId]
	);

	useEffect(() => {
		nextEdgeId && setEdgeActive(nextEdgeId, active || false);
	}, [prevEdgeId, nextEdgeId, setEdgeActive, active]);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>!</Title>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={!active && active !== null}
				rotation={rotation}
				nodeId={id}
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

export default Not;
