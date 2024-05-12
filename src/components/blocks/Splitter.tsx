import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../../utils/appStore';
import { Flex } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { useEffect, useMemo } from 'react';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { NodeData } from '../../utils/interfaces';

interface Props {
	id: string;
	data: NodeData;
}

const Splitter: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData, nodes } = appStore;

	const { rotation, prevNodeIds } = useMemo(() => data, [data]);

	const output: boolean = useMemo(
		() => nodes[prevNodeIds[0]]?.data?.output || false,
		[prevNodeIds, nodes]
	);

	useEffect(() => {
		setNodeData(id, { output });
	}, [id, output, setNodeData]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ margin: 0 }}>
				<ShareAltOutlined />
			</Title>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={output}
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
