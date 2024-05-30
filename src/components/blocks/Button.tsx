import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Button as ButtonAntd, Flex } from 'antd';
import { useCallback, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import TimeRange from '../TimeRange';
import { icons } from '../../utils/types';
import { NodeData } from '../../utils/interfaces';
import useNodeSignal from '../../hooks/useNodeSignal';

interface Props {
	id: string;
	type: string;
	data: NodeData;
}

const Button: React.FC<Props> = observer(({ id, type, data }) => {
	const { setNodeData } = appStore;

	const { delay, rotation } = useMemo(() => data, [data]);

	const { output, setOutput } = useNodeSignal(id, data, type);

	const handleDelayChange = useCallback(
		(delay: number) => {
			setNodeData(id, { delay });
		},
		[setNodeData, id]
	);

	const pressButton = useCallback(() => {
		setOutput(true);
		setTimeout(() => setOutput(false), delay);
	}, [setOutput, delay]);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-between'
			align='center'
		>
			<ButtonAntd
				style={{ marginBlockStart: 'auto' }}
				onClick={pressButton}
			>
				{icons.button}
			</ButtonAntd>
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
				type='source'
				position={'right' as Position}
				active={output || false}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Button;
