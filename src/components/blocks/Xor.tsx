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

const Xor: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData, nodes } = appStore;

	const { rotation, prevNodeIds } = useMemo(() => data, [data]);

	const output: boolean = useMemo(() => {
		if (prevNodeIds.length !== 2) return false;
		const [first, second] = [
			nodes[prevNodeIds[0]]?.data?.output,
			nodes[prevNodeIds[1]]?.data?.output,
		];
		return first !== second;
	}, [nodes, prevNodeIds]);

	useEffect(() => {
		setNodeData(id, { output });
	}, [output, setNodeData, id]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ margin: 0 }}>⊕</Title>
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
