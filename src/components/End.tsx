import { observer } from 'mobx-react-lite';
import { blockStyleSmall } from '../utils/blockStyles';
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
	const { removeNode, edges, setEdgeActive, activeEdges, nodes } = appStore;

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

	const prevEdgeIds: string[] = useMemo(
		() =>
			connectedEdges
				.filter((edge: Edge<any>) => edge.target === id)
				?.map((edge: Edge<any>) => edge.id),
		[connectedEdges, id]
	);

	useEffect(() => {
		try {
			const incoming = prevEdgeIds.some((id: string) => activeEdges[id]);
			setActive(incoming);
		} catch (error) {
			setActive(false);
		}
	}, [setEdgeActive, id, prevEdgeIds, activeEdges]);

	return (
		<Flex
			style={{
				...blockStyleSmall,
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
				active={active}
				position={'left' as Position}
				type='target'
				rotation={rotation}
				styles={{ top: 50 }}
				nodeId={id}
			/>
		</Flex>
	);
});

export default End;
