import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch, Typography } from 'antd';
import {
	LeftOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import Connector from './Connector';
import NodeUtils from './NodeUtils';

interface Props {
	id: string;
	data: { plusDelay: number; minusDelay: number; rotation: number };
}

const Flasher: React.FC<Props> = observer(({ id, data }) => {
	const { edges, setEdgeActive, setNodeParameters, nodes } = appStore;

	const { plusDelay, minusDelay, rotation } = data;

	const [active, setActive] = useState<boolean>(true);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (active) timerId = setInterval(() => setActive(false), plusDelay);

		return () => clearInterval(timerId);
	}, [plusDelay, active]);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (!active) timerId = setInterval(() => setActive(true), minusDelay);

		return () => clearInterval(timerId);
	}, [minusDelay, active]);

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

	const handlePlusDelayChange = useCallback(
		(diff: number) => {
			const newDelay = plusDelay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(node, { plusDelay: newDelay });
		},
		[setNodeParameters, plusDelay, node]
	);

	const handleMinusDelayChange = useCallback(
		(diff: number) => {
			const newDelay = minusDelay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(node, { minusDelay: newDelay });
		},
		[setNodeParameters, minusDelay, node]
	);

	useEffect(() => {
		nextEdgeId && setEdgeActive(nextEdgeId, active);
	}, [setEdgeActive, id, nextEdgeId, active]);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<Switch
				value={active}
				disabled
			/>
			<Flex vertical>
				<Flex gap={4}>
					<PlusCircleOutlined />
					<Flex align='center'>
						<LeftOutlined onClick={() => handlePlusDelayChange(-100)} />
						<Typography.Text>{(plusDelay / 1000).toFixed(1)}</Typography.Text>
						<RightOutlined onClick={() => handlePlusDelayChange(100)} />
					</Flex>
				</Flex>
				<Flex gap={4}>
					<MinusCircleOutlined />
					<Flex align='center'>
						<LeftOutlined onClick={() => handleMinusDelayChange(-100)} />
						<Typography.Text>{(minusDelay / 1000).toFixed(1)}</Typography.Text>
						<RightOutlined onClick={() => handleMinusDelayChange(100)} />
					</Flex>
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

export default Flasher;
