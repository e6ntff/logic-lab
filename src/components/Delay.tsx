import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from './Connector';
import NodeUtils from './NodeUtils';
import GetEdges from '../utils/getEdges';
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const Delay: React.FC<Props> = observer(({ id }) => {
	const { setEdgeActive, activeEdges, setNodeParameters, nodesData } = appStore;

	const { delay, active } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	const incoming: boolean | null = useMemo(
		() => (prevEdgeIds[0] ? activeEdges[prevEdgeIds[0]] : null),
		// eslint-disable-next-line
		[activeEdges[prevEdgeIds[0] as string]]
	);

	useEffect(() => {
		if (incoming)
			setTimeout(() => setNodeParameters(id, { active: true }), delay);
		if (!incoming)
			setTimeout(() => setNodeParameters(id, { active: false }), delay);
	}, [incoming, delay, id, setNodeParameters]);

	const handleDelayChange = useCallback(
		(diff: number) => {
			const newDelay = (delay || 0) + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(id, { delay: newDelay });
		},
		[setNodeParameters, delay, id]
	);

	useEffect(() => {
		nextEdgeIds[0] && setEdgeActive(nextEdgeIds[0], active || false);
	}, [setEdgeActive, nextEdgeIds, active]);

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
					<Typography.Text>{((delay || 0) / 1000).toFixed(1)}</Typography.Text>
					<RightOutlined onClick={() => handleDelayChange(100)} />
				</Flex>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active || false}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Delay;
