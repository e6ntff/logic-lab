import { observer } from 'mobx-react-lite';
import { Edge, Handle, Position } from 'reactflow';
import { connectorStyle, orStyle } from '../utils/blockStyles';
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

	const incoming: [boolean, boolean] = useMemo(
		() => [activeEdges[prevEdgeIds[0]], activeEdges[prevEdgeIds[1]]],
		// eslint-disable-next-line
		[activeEdges[prevEdgeIds[0]], activeEdges[prevEdgeIds[1]], prevEdgeIds]
	);

	useEffect(() => {
		if (!prevEdgeIds.length || !nextEdgeId) return;
		const outgoing = incoming[0] || incoming[1];
		setEdgeActive(nextEdgeId, outgoing);
	}, [prevEdgeIds, nextEdgeId, incoming, setEdgeActive]);

	return (
		<Flex
			style={orStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>OR</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='target'
				position={'left' as Position}
				style={{
					top: '33.3%',
					bottom: '66.6%',
					...connectorStyle,
				}}
			/>
			<Handle
				id='b'
				type='target'
				position={'left' as Position}
				style={{
					top: '66.6%',
					bottom: '33.3%',
					...connectorStyle,
				}}
			/>
			<Handle
				id='c'
				type='source'
				position={'right' as Position}
				style={{ top: '50%', ...connectorStyle }}
			/>
		</Flex>
	);
});

export default Or;
