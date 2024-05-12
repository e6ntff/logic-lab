import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Divider, Flex, Switch } from 'antd';
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

const Flasher: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData } = appStore;

	const { plusDelay, minusDelay, output, rotation } = useMemo(
		() => data,
		[data]
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
		(diff: number) => {
			let newDelay = (plusDelay || 0) + diff;
			if (newDelay > 10000) newDelay = 10000;
			if (newDelay < 100) newDelay = 100;
			setNodeData(id, { plusDelay: newDelay });
		},
		[setNodeData, plusDelay, id]
	);

	const handleMinusDelayChange = useCallback(
		(diff: number) => {
			let newDelay = (minusDelay || 0) + diff;
			if (newDelay > 10000) newDelay = 10000;
			if (newDelay < 100) newDelay = 100;
			setNodeData(id, { minusDelay: newDelay });
		},
		[setNodeData, minusDelay, id]
	);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<Switch
				value={output}
				disabled
			/>
			<Flex
				vertical
				gap={4}
				style={{ inlineSize: '100%' }}
			>
				<TimeRange
					value={plusDelay}
					id={id}
					onChange={handlePlusDelayChange}
				/>
				<Divider style={{ margin: 0 }} />
				<TimeRange
					value={minusDelay}
					id={id}
					onChange={handleMinusDelayChange}
				/>
			</Flex>
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
