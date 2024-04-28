import { observer } from 'mobx-react-lite';
import { Edge, Handle, Position } from 'reactflow';
import { connectorStyle, blockStyleLarge } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';

interface Props {
	id: string;
}

const Or: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, setEdgeActive, activeEdges } = appStore;

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
			style={{ ...blockStyleLarge, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>||</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='target'
				position={'left' as Position}
				style={{
					top: 40,
					...connectorStyle,
					background: activeConnectors.a ? '#f00' : '#000',
				}}
			/>
			<Handle
				id='b'
				type='target'
				position={'left' as Position}
				style={{
					top: 120,
					...connectorStyle,
					background: activeConnectors.b ? '#f00' : '#000',
				}}
			/>
			<Handle
				id='c'
				type='source'
				position={'right' as Position}
				style={{
					top: '50%',
					...connectorStyle,
					background: activeConnectors.c ? '#f00' : '#000',
				}}
			/>
		</Flex>
	);
});

export default Or;
