import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch, Typography } from 'antd';
import {
	CloseOutlined,
	LeftOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import Connector from './Connector';
import RotationPanel from './NodeUtils';

interface Props {
	id: string;
	data: { plusDelay: number; minusDelay: number; rotate: number };
}

const Flasher: React.FC<Props> = observer(({ id, data }) => {
	const {
		removeNode,
		edges,
		setEdgeActive,
		changePlusDelay,
		changeMinusDelay,
		nodes,
	} = appStore;

	const { plusDelay, minusDelay } = data;

	const [active, setActive] = useState<boolean>(true);
	const [rotation, setRotation] = useState<number>(0);

	const handlePlusDelayChange = useCallback(
		(diff: number) => {
			const newDelay = plusDelay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			changePlusDelay(id, newDelay);
		},
		[changePlusDelay, plusDelay, id]
	);

	const handleMinusDelayChange = useCallback(
		(diff: number) => {
			const newDelay = minusDelay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			changeMinusDelay(id, newDelay);
		},
		[changeMinusDelay, minusDelay, id]
	);

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

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const node = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const nextEdgeIds: string[] = useMemo(
		() =>
			connectedEdges
				.filter((edge: Edge<any>) => edge.source === id)
				?.map((edge: Edge<any>) => edge.id),
		[connectedEdges, id]
	);

	useEffect(() => {
		try {
			nextEdgeIds.forEach((id: string) => {
				setEdgeActive(id, active);
			});
		} catch (error) {}
	}, [setEdgeActive, id, nextEdgeIds, active]);

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
