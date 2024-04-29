import { observer } from 'mobx-react-lite';
import { Edge, Position } from 'reactflow';
import { linkStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from './Connector';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface Props {
	id: string;
	data: { rotate: number };
}

const Link: React.FC<Props> = observer(({ id }) => {
	const { edges, setEdgeActive, activeEdges, removeNode } = appStore;

	const [prevEdgeId, nextEdgeId]: [string | undefined, string | undefined] =
		useMemo(
			() => [
				edges.find((edge: Edge<any>) => edge.target === id)?.id,
				edges.find((edge: Edge<any>) => edge.source === id)?.id,
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
		nextEdgeId && setEdgeActive(nextEdgeId, incoming || false);
	}, [nextEdgeId, incoming, setEdgeActive]);

	return (
		<Flex
			justify='center'
			align='center'
			style={{ ...linkStyle }}
		>
			<PlusCircleOutlined
				className='dragHandle'
				style={{ position: 'absolute', top: -20, left: -5 }}
			/>
			<CloseOutlined
				style={{ position: 'absolute', top: -20, left: 10 }}
				onClick={() => removeNode(id)}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
				styles={{}}
				rotation={0}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={incoming}
				styles={{}}
				rotation={0}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Link;