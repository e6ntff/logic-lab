import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Button as ButtonAntd, Flex, Typography } from 'antd';
import {
	LeftOutlined,
	PlayCircleOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from './Connector';
import NodeUtils from './NodeUtils';
import GetEdges from '../utils/getEdges';
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const Button: React.FC<Props> = observer(({ id }) => {
	const { setEdgeActive, setNodeParameters, nodesData } = appStore;

	const { delay, active } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const { nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	useEffect(() => {
		if (active)
			setTimeout(() => setNodeParameters(id, { active: false }), delay);
	}, [delay, active, setNodeParameters, id]);

	useEffect(() => {
		nextEdgeIds[0] && setEdgeActive(nextEdgeIds[0], active || false);
	}, [setEdgeActive, id, nextEdgeIds, active]);

	const handleDelayChange = useCallback(
		(diff: number) => {
			const newDelay = (delay || 0) + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			setNodeParameters(id, { delay: newDelay });
		},
		[setNodeParameters, delay, id]
	);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<ButtonAntd onClick={() => setNodeParameters(id, { active: true })}>
				<PlayCircleOutlined />
			</ButtonAntd>
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
				type='source'
				position={'right' as Position}
				active={active || false}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Button;
