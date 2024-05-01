import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import Connector from './Connector';
import NodeUtils from './NodeUtils';

interface Props {
	id: string;
	data: { delay: number; rotation: number };
}

const Delay: React.FC<Props> = observer(({ id, data }) => {
	const { edges, setEdgeActive, activeEdges, setNodeParameters, nodes } =
		appStore;

	const { delay, rotation } = data;

	const [active, setActive] = useState<boolean>(false);

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

	const incoming: boolean | null = useMemo(
		() => (prevEdgeId ? activeEdges[prevEdgeId] : null),
		// eslint-disable-next-line
		[activeEdges[prevEdgeId as string]]
	);

	useEffect(() => {
		if (incoming) setTimeout(() => setActive(true), delay);
		if (!incoming) setTimeout(() => setActive(false), delay);
	}, [incoming, delay]);

	const handleDelayChange = useCallback(
		(diff: number) => {
			const newDelay = delay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(node, { delay: newDelay });
		},
		[setNodeParameters, delay, node]
	);

	useEffect(() => {
		nextEdgeId && setEdgeActive(nextEdgeId, active);
	}, [setEdgeActive, nextEdgeId, active]);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<Flex gap={4}>
				<Flex align='center'>
					<LeftOutlined onClick={() => handleDelayChange(-100)} />
					<Typography.Text>{(delay / 1000).toFixed(1)}</Typography.Text>
					<RightOutlined onClick={() => handleDelayChange(100)} />
				</Flex>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
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

export default Delay;
