import { observer } from 'mobx-react-lite';
import { Edge, Position } from 'reactflow';
import { blockStyleLarge } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Connector from './Connector';
import RotationPanel from './RotationPanel';

interface Props {
	id: string;
	data: { rotate: number };
}

const Or: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, setEdgeActive, activeEdges } = appStore;

	const [rotation, setRotation] = useState<number>(0);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const [prevEdgeIds, nextEdgeId]: [string[], string | undefined] = useMemo(
		() => [
			edges
				.filter((edge: Edge<any>) => edge.target === id)
				?.map((edge: Edge<any>) => edge.id)
				.slice(0, 2),
			edges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[edges, id]
	);

	const incoming: [boolean, boolean] | null = useMemo(
		() => {
			if (prevEdgeIds.length < 2) return null;
			return [activeEdges[prevEdgeIds[0]], activeEdges[prevEdgeIds[1]]];
		},
		// eslint-disable-next-line
		[activeEdges[prevEdgeIds[0]], activeEdges[prevEdgeIds[1]], prevEdgeIds]
	);

	const outgoing: boolean | null = useMemo(() => {
		if (incoming === null) return null;
		return incoming[0] || incoming[1];
	}, [incoming]);

	useEffect(() => {
		if (!nextEdgeId) return;
		setEdgeActive(nextEdgeId, outgoing || false);
	}, [prevEdgeIds, nextEdgeId, incoming, outgoing, setEdgeActive]);

	const activeConnectors: { [key: string]: boolean | null } = useMemo(() => {
		const result: { [key: string]: boolean } = {};
		prevEdgeIds.forEach((id: string) => {
			const prevEdge = edges.find((edge: Edge<any>) => edge.id === id);
			if (prevEdge?.targetHandle)
				result[prevEdge.targetHandle] = activeEdges[id];
		});
		return { ...result, c: outgoing };
	}, [prevEdgeIds, activeEdges, edges, outgoing]);

	return (
		<Flex
			style={{ ...blockStyleLarge(rotation), background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>||</Title>
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
				active={activeConnectors.a}
				styles={{
					top: 50,
				}}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='target'
				position={'left' as Position}
				active={activeConnectors.b}
				styles={{
					top: 170,
				}}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='c'
				type='source'
				position={'right' as Position}
				active={activeConnectors.c}
				styles={{
					top: 110,
				}}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Or;
