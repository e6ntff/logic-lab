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

interface Props {
	id: string;
}

const Button: React.FC<Props> = observer(({ id }) => {
	const { setNodeData, nodesData } = appStore;

	const { delay, output, rotation } = useMemo(
		() => nodesData[id],
		[nodesData, id]
	);

	useEffect(() => {
		if (output) setTimeout(() => setNodeData(id, { output: false }), delay);
	}, [delay, output, setNodeData, id]);

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
			justify='space-between'
			align='center'
		>
			<ButtonAntd
				style={{ marginBlockStart: 'auto' }}
				onClick={() => setNodeData(id, { output: true })}
			>
				<PlayCircleOutlined />
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
