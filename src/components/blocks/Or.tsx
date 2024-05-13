import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';

interface Props {
	id: string;
}

const Or: React.FC<Props> = observer(({ id }) => {
	const { setNodeData, nodesData } = appStore;

	const { rotation, prevNodeIds } = useMemo(
		() => nodesData[id],
		[nodesData, id]
	);

	const output: boolean = useMemo(
		() =>
			prevNodeIds.length > 0 &&
			prevNodeIds.some((id: string) => nodesData[id]?.output),
		[prevNodeIds, nodesData]
	);

	useEffect(() => {
		setNodeData(id, { output });
	}, [id, setNodeData, output]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ margin: 0 }}>||</Title>
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
				maxConnections={Infinity}
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

export default Or;
