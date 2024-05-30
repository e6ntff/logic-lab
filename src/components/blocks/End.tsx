import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import { Flex } from 'antd';
import { Position } from 'reactflow';
import Title from 'antd/es/typography/Title';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { icons } from '../../utils/types';
import useNodeSignal from '../../hooks/useNodeSignal';
import { NodeData } from '../../utils/interfaces';
import { useMemo } from 'react';

interface Props {
	id: string;
	type: string;
	data: NodeData;
}

const End: React.FC<Props> = observer(({ id, type, data }) => {
	const { rotation } = useMemo(() => data, [data]);

	const { input } = useNodeSignal(id, data, type);

	return (
		<Flex
			style={{
				...blockStyle,
				background: input ? '#ff0' : '#555',
			}}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>{icons.end}</Title>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			<Connector
				id='a'
				type='target'
				active={input}
				position={'left' as Position}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default End;
