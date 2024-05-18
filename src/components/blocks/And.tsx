import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore, { defaultNodeData } from '../../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from '../Connector';
import RotationPanel from '../NodeUtils';
import { icons, nodeTypes } from '../../utils/types';

interface Props {
	id: string;
}

const And: React.FC<Props> = observer(({ id }) => {
	const { nodesData, setNodeData } = appStore;

	const { rotation, prevNodeIds } = useMemo(
		() => (Object.hasOwn(nodeTypes, id) ? defaultNodeData : nodesData[id]),
		[nodesData, id]
	);

	const output: boolean = useMemo(
		() =>
			prevNodeIds.length > 0 &&
			prevNodeIds.every((id: string) => nodesData[id]?.output),
		[prevNodeIds, nodesData]
	);

	useEffect(() => {
		setNodeData(id, { output });
	}, [id, output, setNodeData]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#f00' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#fff', margin: 0 }}>{icons.and}</Title>
			<RotationPanel
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

export default And;
