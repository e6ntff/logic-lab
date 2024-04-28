import { observer } from 'mobx-react-lite';
import { startStyle, connectorStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Handle, Position } from 'reactflow';

interface Props {
	id: string;
}

const Start: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, setEdgeActive } = appStore;

	const [active, setActive] = useState<boolean>(true);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const nextEdgeId: string | undefined = useMemo(
		() => edges.find((edge: Edge<any>) => edge.source === id)?.id,
		[edges, id]
	);

	useEffect(() => {
		try {
			if (!nextEdgeId) return;
			const outgoing = active;
			setEdgeActive(nextEdgeId, outgoing);
		} catch (error) {}
	}, [setEdgeActive, id, nextEdgeId, active]);

	const toggleStartSignal = useCallback(() => {
		setActive((prev: boolean) => !prev);
		// eslint-disable-next-line
	}, [setActive]);

	return (
		<Flex
			style={startStyle}
			justify='center'
			align='center'
			onClick={toggleStartSignal}
		>
			<Title style={{ color: '#000', margin: 0 }}>
				{active ? <PlusOutlined /> : <MinusOutlined />}
			</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='source'
				position={'right' as Position}
				style={{ top: '50%', ...connectorStyle }}
			/>
		</Flex>
	);
});

export default Start;
