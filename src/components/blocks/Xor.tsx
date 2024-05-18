import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore, { defaultNodeData } from '../../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import { icons, nodeTypes } from '../../utils/types';

interface Props {
	id: string;
}

const Xor: React.FC<Props> = observer(({ id }) => {
	const { setNodeData, nodesData } = appStore;

	const { rotation, prevNodeIds } = useMemo(
		() => (Object.hasOwn(nodeTypes, id) ? defaultNodeData : nodesData[id]),
		[nodesData, id]
	);

	const output: boolean = useMemo(() => {
		if (prevNodeIds.length !== 2) return false;
		const [first, second] = [
			nodesData[prevNodeIds[0]]?.output,
			nodesData[prevNodeIds[1]]?.output,
		];
		return first !== second;
		// eslint-disable-next-line
	}, [nodesData[prevNodeIds[0]], nodesData[prevNodeIds[1]], prevNodeIds]);

	useEffect(() => {
		setNodeData(id, { output });
	}, [output, setNodeData, id]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ margin: 0 }}>{icons.xor}</Title>
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
				maxConnections={2}
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

export default Xor;
