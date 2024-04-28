import { observer } from 'mobx-react-lite';
import { blockStyleSmall, connectorStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
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

	return (
		<Flex
			style={blockStyleSmall}
			justify='center'
			align='center'
		>
			<Switch
				onChange={setActive}
				value={active}
			/>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='source'
				position={'right' as Position}
				style={{
					top: '50%',
					...connectorStyle,
					background: active ? '#f00' : '#000',
				}}
			/>
		</Flex>
	);
});

export default Start;
