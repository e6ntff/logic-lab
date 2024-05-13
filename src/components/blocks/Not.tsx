import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import { NodeData } from '../../utils/interfaces';

interface Props {
	id: string;
	data: NodeData;
}

const Not: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData, nodes } = appStore;

	const { rotation, prevNodeIds } = useMemo(() => data, [data]);

	const output: boolean = useMemo(
		() => prevNodeIds.length > 0 && !nodes[prevNodeIds[0]]?.data?.output,
		// eslint-disable-next-line
		[nodes[prevNodeIds[0]], prevNodeIds]
	);

	useEffect(() => {
		setNodeData(id, { output });
	}, [id, setNodeData, output]);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Title style={{ margin: 0 }}>!</Title>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={!output && prevNodeIds.length > 0}
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
			/>
		</Flex>
	);
});

export default Not;
