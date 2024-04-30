import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { BulbOutlined, CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import Title from 'antd/es/typography/Title';
import RotationPanel from './NodeUtils';
import Connector from './Connector';

interface Props {
	id: string;
	data: { rotate: number };
}

const End: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, activeEdges, nodes } = appStore;

	const [active, setActive] = useState<boolean>(false);
	const [rotation, setRotation] = useState<number>(0);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const node = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const prevEdgeId: string | null = useMemo(
		() =>
			connectedEdges.find((edge: Edge<any>) => edge.target === id)?.id || null,
		[connectedEdges, id]
	);

	useEffect(() => {
		setActive(prevEdgeId ? activeEdges[prevEdgeId] : false);
		// eslint-disable-next-line
	}, [setActive, prevEdgeId, activeEdges[prevEdgeId as string]]);

	return (
		<Flex
			style={{
				...blockStyle,
				background: active ? '#ff0' : '#555',
			}}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<BulbOutlined />
			</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
			<Connector
				id='a'
				type='target'
				active={active}
				position={'left' as Position}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default End;
