import { observer } from 'mobx-react-lite';
import { Edge, Handle, Position } from 'reactflow';
import { connectorStyle, blockStyleLarge } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';

interface Props {
	id: string;
}

const Splitter: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, setEdgeActive, activeEdges } = appStore;

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const [prevEdgeId, nextEdgeIds]: [string | undefined, string[]] = useMemo(
		() => [
			edges.find((edge: Edge<any>) => edge.target === id)?.id,
			edges
				.filter((edge: Edge<any>) => edge.source === id)
				?.map((edge: Edge<any>) => edge.id)
				.slice(0, 2),
		],
		[edges, id]
	);

	const incoming: boolean | null = useMemo(
		() => {
			if (!prevEdgeId) return null;
			return activeEdges[prevEdgeId];
		},
		// eslint-disable-next-line
		[activeEdges[prevEdgeId as string], prevEdgeId]
	);

	useEffect(() => {
		nextEdgeIds.forEach((id: string) => {
			setEdgeActive(id, incoming || false);
		});
	}, [nextEdgeIds, incoming, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyleLarge, background: '#0f0' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<ShareAltOutlined />
			</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='target'
				position={'left' as Position}
				style={{
					top: '50%',
					...connectorStyle,
					background: incoming ? '#f00' : '#000',
				}}
			/>
			<Handle
				id='b'
				type='source'
				position={'right' as Position}
				style={{
					top: 50,
					...connectorStyle,
					background: incoming ? '#f00' : '#000',
				}}
			/>
			<Handle
				id='c'
				type='source'
				position={'right' as Position}
				style={{
					top: 130,
					...connectorStyle,
					background: incoming ? '#f00' : '#000',
				}}
			/>
		</Flex>
	);
});

export default Splitter;
