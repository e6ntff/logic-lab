import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Flex } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import TimeRange from '../TimeRange';

interface Props {
	id: string;
}

const Delay: React.FC<Props> = observer(({ id }) => {
	const { setNodeData, nodesData } = appStore;

	const { delay, output, rotation, prevNodeIds } = useMemo(
		() => nodesData[id],
		[nodesData, id]
	);

	const input: boolean = useMemo(
		() => nodesData[prevNodeIds[0]]?.output || false,
		// eslint-disable-next-line
		[nodesData[prevNodeIds[0]], prevNodeIds]
	);

	useEffect(() => {
		if (input) setTimeout(() => setNodeData(id, { output: true }), delay);
		if (!input) setTimeout(() => setNodeData(id, { output: false }), delay);
	}, [input, delay, setNodeData, id]);

	const handleDelayChange = useCallback(
		(delay: number) => {
			setNodeData(id, { delay });
		},
		[setNodeData, id]
	);

	useEffect(() => {
		setNodeData(id, { output });
	}, [setNodeData, id, output]);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<TimeRange
				onChange={handleDelayChange}
				value={delay}
			/>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={input}
				nodeId={id}
				rotation={rotation}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={output || false}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Delay;
