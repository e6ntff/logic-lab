import { observer } from 'mobx-react-lite';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Connector from './Connector';
import RotationPanel from './NodeUtils';

interface Props {
	id: string;
	data: { rotate: number };
}

const Not: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, activeEdges, setEdgeActive, nodes } = appStore;

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

	const [prevEdgeId, nextEdgeId]: (string | undefined)[] = useMemo(
		() => [
			connectedEdges.find((edge: Edge<any>) => edge.target === id)?.id,
			connectedEdges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[connectedEdges, id]
	);

	useEffect(() => {
		const active = prevEdgeId ? !activeEdges[prevEdgeId] : false;
		setActive(active);
		nextEdgeId && setEdgeActive(nextEdgeId, active);
	}, [prevEdgeId, activeEdges, nextEdgeId, setEdgeActive]);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>!</Title>
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
				position={'left' as Position}
				active={!active}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Not;
