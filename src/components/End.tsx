import { observer } from 'mobx-react-lite';
import { blockStyleSmall } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { BulbOutlined, CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Position } from 'reactflow';
import Title from 'antd/es/typography/Title';
import RotationPanel from './RotationPanel';
import Connector from './Connector';

interface Props {
	id: string;
	data: { rotate: number };
}

const End: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, setEdgeActive, activeEdges } = appStore;

	const [active, setActive] = useState<boolean>(false);
	const [rotation, setRotation] = useState<number>(0);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const prevEdgeId: string | undefined = useMemo(
		() => edges.find((edge: Edge<any>) => edge.target === id)?.id,
		[edges, id]
	);

	useEffect(() => {
		try {
			const incoming = activeEdges[prevEdgeId as string];
			setActive(incoming);
		} catch (error) {
			setActive(false);
		}
	}, [setEdgeActive, id, prevEdgeId, activeEdges]);

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
				styles={{ top: '50%' }}
				nodeId={id}
			/>
		</Flex>
	);
});

export default End;
