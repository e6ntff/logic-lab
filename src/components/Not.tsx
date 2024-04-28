import { observer } from 'mobx-react-lite';
import { Edge, Position } from 'reactflow';
import { blockStyleSmall } from '../utils/blockStyles';
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

const Not: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, activeEdges, setEdgeActive } = appStore;

	const [rotation, setRotation] = useState<number>(0);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const [prevEdgeId, nextEdgeId]: (string | undefined)[] = useMemo(
		() => [
			edges.find((edge: Edge<any>) => edge.target === id)?.id,
			edges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[edges, id]
	);

	const incoming: boolean | null = useMemo(() => {
		try {
			return prevEdgeId ? activeEdges[prevEdgeId] : null;
		} catch (error) {
			return false;
		}
		// eslint-disable-next-line
	}, [activeEdges[prevEdgeId as string]]);

	const outgoing: boolean | null = useMemo(
		() => (incoming !== null ? !incoming : null),
		[incoming]
	);

	useEffect(() => {
		setEdgeActive(nextEdgeId as string, outgoing || false);
	}, [nextEdgeId, setEdgeActive, outgoing]);

	const activeConnectors = useMemo(
		() => ({ a: incoming, b: outgoing }),
		[incoming, outgoing]
	);

	return (
		<Flex
			style={blockStyleSmall}
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
				active={activeConnectors.a}
				styles={{
					top: '50%',
				}}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={activeConnectors.b}
				styles={{
					top: '50%',
				}}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Not;
