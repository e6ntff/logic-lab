import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import { Flex } from 'antd';
import { useMemo } from 'react';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { icons } from '../../utils/types';
import { NodeData } from '../../utils/interfaces';
import useNodeSignal from '../../hooks/useNodeSignal';

interface Props {
	id: string;
	type: string;
	data: NodeData;
}

const Splitter: React.FC<Props> = observer(({ id, type, data }) => {
	const { rotation } = useMemo(() => data, [data]);

	const { input, output } = useNodeSignal(id, data, type);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ margin: 0 }}>{icons.splitter}</Title>
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
				maxConnections={Infinity}
			/>
		</Flex>
	);
});

export default Splitter;
