import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Flex } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import TimeRange from '../TimeRange';
import { NodeData } from '../../utils/interfaces';

interface Props {
	id: string;
	data: NodeData;
}

const Delay: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData, nodes } = appStore;

	const { delay, output, rotation, prevNodeIds } = useMemo(() => data, [data]);

	const incoming: boolean = useMemo(
		() => nodes[prevNodeIds[0]]?.data?.output || false,
		[prevNodeIds, nodes]
	);

	useEffect(() => {
		if (incoming) setTimeout(() => setNodeData(id, { output: true }), delay);
		if (!incoming) setTimeout(() => setNodeData(id, { output: false }), delay);
	}, [incoming, delay, setNodeData, id]);

	const handleDelayChange = useCallback(
		(diff: number) => {
			let newDelay = (delay || 0) + diff;
			if (newDelay > 10000) newDelay = 10000;
			if (newDelay < 0) newDelay = 0;
			setNodeData(id, { delay: newDelay });
		},
		[setNodeData, delay, id]
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
				id={id}
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
				active={incoming}
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
