import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Button as ButtonAntd, Flex } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
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

const Button: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData } = appStore;

	const { delay, output, rotation } = useMemo(() => data, [data]);

	useEffect(() => {
		if (output) setTimeout(() => setNodeData(id, { output: false }), delay);
	}, [delay, output, setNodeData, id]);

	const handleDelayChange = useCallback(
		(diff: number) => {
			let newDelay = (delay || 0) + diff;
			if (newDelay > 10000) newDelay = 10000;
			if (newDelay < 100) newDelay = 100;
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
			<ButtonAntd onClick={() => setNodeData(id, { output: true })}>
				<PlayCircleOutlined />
			</ButtonAntd>
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
