import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { Position } from 'reactflow';
import Title from 'antd/es/typography/Title';
import NodeUtils from './NodeUtils';
import Connector from './Connector';
import GetEdges from '../utils/getEdges';

interface Props {
	id: string;
}

const End: React.FC<Props> = observer(({ id }) => {
	const { activeEdges } = appStore;
	
	const { prevEdgeIds } = GetEdges(id, { prev: true, next: false });

	const incoming = useMemo(
		() => (prevEdgeIds[0] ? activeEdges[prevEdgeIds[0]] : false),
		// eslint-disable-next-line
		[prevEdgeIds[0], activeEdges[prevEdgeIds[0]]]
	);

	return (
		<Flex
			style={{
				...blockStyle,
				background: incoming ? '#ff0' : '#555',
			}}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<BulbOutlined />
			</Title>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				active={incoming}
				position={'left' as Position}
				nodeId={id}
			/>
		</Flex>
	);
});

export default End;
