import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import { Flex } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { Position } from 'reactflow';
import Title from 'antd/es/typography/Title';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { NodeData } from '../../utils/interfaces';
import appStore from '../../utils/appStore';

interface Props {
	id: string;
	data: NodeData;
}

const End: React.FC<Props> = observer(({ id, data }) => {
	const { nodes } = appStore;

	const { prevNodeIds, rotation } = useMemo(() => data, [data]);

	const input: boolean = useMemo(
		() => nodes[prevNodeIds[0]]?.data?.output || false,
		[nodes, prevNodeIds]
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
