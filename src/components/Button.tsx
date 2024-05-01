import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Button as ButtonAntd, Flex, Typography } from 'antd';
import {
	LeftOutlined,
	PlayCircleOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import Connector from './Connector';
import NodeUtils from './NodeUtils';

interface Props {
	id: string;
	data: { delay: number; rotation: number };
}

const Button: React.FC<Props> = observer(({ id, data }) => {
	const { edges, setEdgeActive, nodes, setNodeParameters } = appStore;

	const { delay, rotation } = data;

	const [active, setActive] = useState<boolean>(false);

	useEffect(() => {
		if (active) setTimeout(() => setActive(false), delay);
	}, [delay, active]);

	const node = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const nextEdgeId: string | undefined = useMemo(
		() => connectedEdges.find((edge: Edge<any>) => edge.source === id)?.id,
		[connectedEdges, id]
	);

	useEffect(() => {
		nextEdgeId && setEdgeActive(nextEdgeId, active);
	}, [setEdgeActive, id, nextEdgeId, active]);

	const handleDelayChange = useCallback(
		(diff: number) => {
			const newDelay = delay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(node, { delay: newDelay });
		},
		[setNodeParameters, delay, node]
	);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<ButtonAntd onClick={() => setActive(true)}>
				<PlayCircleOutlined />
			</ButtonAntd>
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
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Button;
