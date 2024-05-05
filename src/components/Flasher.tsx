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
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from './Connector';
import NodeUtils from './NodeUtils';
import GetEdges from '../utils/getEdges';
import getNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const Flasher: React.FC<Props> = observer(({ id }) => {
	const { setEdgeActive, setNodeParameters, nodesData } = appStore;

	const { plusDelay, minusDelay, active } = useMemo(
		() => getNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (active)
			timerId = setTimeout(
				() => setNodeParameters(id, { active: false }),
				plusDelay
			);

		return () => clearTimeout(timerId);
	}, [plusDelay, active, setNodeParameters, id]);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (!active)
			timerId = setTimeout(
				() => setNodeParameters(id, { active: true }),
				minusDelay
			);

		return () => clearTimeout(timerId);
	}, [minusDelay, active, setNodeParameters, id]);

	const { nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	const handlePlusDelayChange = useCallback(
		(diff: number) => {
			const newDelay = (plusDelay || 0) + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(id, { plusDelay: newDelay });
		},
		[setNodeParameters, plusDelay, id]
	);

	const handleMinusDelayChange = useCallback(
		(diff: number) => {
			const newDelay = (minusDelay || 0) + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(id, { minusDelay: newDelay });
		},
		[setNodeParameters, minusDelay, id]
	);

	useEffect(() => {
		nextEdgeIds[0] && setEdgeActive(nextEdgeIds[0], active || false);
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
						<Typography.Text>
							{((plusDelay || 0) / 1000).toFixed(1)}
						</Typography.Text>
						<RightOutlined onClick={() => handlePlusDelayChange(100)} />
					</Flex>
				</Flex>
				<Flex gap={4}>
					<MinusCircleOutlined />
					<Flex align='center'>
						<LeftOutlined onClick={() => handleMinusDelayChange(-100)} />
						<Typography.Text>
							{((minusDelay || 0) / 1000).toFixed(1)}
						</Typography.Text>
						<RightOutlined onClick={() => handleMinusDelayChange(100)} />
					</Flex>
				</Flex>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={active || false}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Flasher;
