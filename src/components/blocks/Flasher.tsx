import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore, { defaultNodeData } from '../../utils/appStore';
import { Flex, Switch } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import TimeRange from '../TimeRange';
import { nodeTypes } from '../../utils/types';

interface Props {
	id: string;
}

const Flasher: React.FC<Props> = observer(({ id }) => {
	const { setNodeData, nodesData } = appStore;

	const { plusDelay, minusDelay, output, rotation } = useMemo(
		() => (Object.hasOwn(nodeTypes, id) ? defaultNodeData : nodesData[id]),
		[nodesData, id]
	);


	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (output)
			timerId = setTimeout(() => setNodeData(id, { output: false }), plusDelay);

		return () => clearTimeout(timerId);
	}, [plusDelay, output, id, setNodeData]);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (!output)
			timerId = setTimeout(() => setNodeData(id, { output: true }), minusDelay);

		return () => clearTimeout(timerId);
	}, [minusDelay, output, id, setNodeData]);

	useEffect(() => {
		setNodeData(id, { output });
	}, [setNodeData, id, output]);

	const handlePlusDelayChange = useCallback(
		(plusDelay: number) => {
			setNodeData(id, { plusDelay });
		},
		[setNodeData, id]
	);

	const handleMinusDelayChange = useCallback(
		(minusDelay: number) => {
			setNodeData(id, { minusDelay });
		},
		[setNodeData, id]
	);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<TimeRange
				value={plusDelay}
				onChange={handlePlusDelayChange}
			/>
			<Switch
				value={output}
				disabled
			/>
			<TimeRange
				value={minusDelay}
				onChange={handleMinusDelayChange}
			/>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={output || false}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Flasher;
