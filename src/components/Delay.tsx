import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Typography } from 'antd';
import {
	CloseOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import Connector from './Connector';
import RotationPanel from './NodeUtils';

interface Props {
	id: string;
	data: { delay: number; rotate: number };
}

const Delay: React.FC<Props> = observer(({ id, data }) => {
	const { removeNode, edges, setEdgeActive, activeEdges, changeDelay, nodes } =
		appStore;
	const { delay } = data;

	const [active, setActive] = useState<boolean>(false);
	const [rotation, setRotation] = useState<number>(0);

	const handleDelayChange = useCallback(
		(diff: number) => {
			const newDelay = delay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			changeDelay(id, newDelay);
		},
		[changeDelay, delay, id]
	);

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

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	useEffect(() => {
		try {
			if (!nextEdgeId) return;
			setEdgeActive(nextEdgeId, active);
		} catch (error) {}
	}, [setEdgeActive, id, nextEdgeId, active]);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<Flex
				align='center'
				gap={4}
			>
				<MinusCircleOutlined onClick={() => handleDelayChange(-100)} />
				<PlusCircleOutlined onClick={() => handleDelayChange(100)} />
				<Typography.Text>
					{(Math.floor(delay / 100) / 10).toFixed(1)}
				</Typography.Text>
			</Flex>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
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
