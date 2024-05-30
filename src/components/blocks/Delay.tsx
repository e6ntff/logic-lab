import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import { Flex } from 'antd';
import { useCallback, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import TimeRange from '../TimeRange';
import appStore from '../../utils/appStore';
import { NodeData } from '../../utils/interfaces';
import useNodeSignal from '../../hooks/useNodeSignal';

interface Props {
	id: string;
	type: string;
	data: NodeData;
}

const Delay: React.FC<Props> = observer(({ id, type, data }) => {
	const { setNodeData } = appStore;

	const { delay, rotation } = useMemo(() => data, [data]);

	const { input, output } = useNodeSignal(id, data, type);

	const handleDelayChange = useCallback(
		(delay: number) => {
			setNodeData(id, { delay });
		},
		[setNodeData, id]
	);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='end'
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
				active={output}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Delay;
