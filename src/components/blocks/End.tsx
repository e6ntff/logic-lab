import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import { Flex } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { Position } from 'reactflow';
import Title from 'antd/es/typography/Title';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import appStore from '../../utils/appStore';

interface Props {
	id: string;
}

const End: React.FC<Props> = observer(({ id }) => {
	const { nodesData } = appStore;

	const { prevNodeIds, rotation } = useMemo(
		() => nodesData[id],
		[nodesData, id]
	);

	const input: boolean = useMemo(
		() => nodesData[prevNodeIds[0]]?.output || false,
		// eslint-disable-next-line
		[nodesData[prevNodeIds[0]], prevNodeIds]
	);

	return (
		<Flex
			style={{
				...blockStyle,
				background: input ? '#ff0' : '#555',
			}}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<BulbOutlined />
			</Title>
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
