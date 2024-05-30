import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Flex, Switch } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import TimeRange from '../TimeRange';
import { NodeData } from '../../utils/interfaces';
import useNodeSignal from '../../hooks/useNodeSignal';

interface Props {
	id: string;
	type: string;
	data: NodeData;
}

const Flasher: React.FC<Props> = observer(({ id, type, data }) => {
	const { setNodeData } = appStore;

	const { plusDelay, minusDelay, rotation } = useMemo(() => data, [data]);

	const { output, setOutput } = useNodeSignal(id, data, type);

	useEffect(() => {
		const timeout = setTimeout(
			() => setOutput(!output),
			output ? plusDelay : minusDelay
		);

		return () => clearTimeout(timeout);
	}, [output, plusDelay, minusDelay, setOutput]);

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
				active={output}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Flasher;
