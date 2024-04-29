import { observer } from 'mobx-react-lite';
import { blockStyleSmall } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Edge, Position } from 'reactflow';
import RotationPanel from './NodeUtils';
import Connector from './Connector';

interface Props {
	id: string;
	data: { rotate: number };
}

const Start: React.FC<Props> = observer(({ id }) => {
	const { edges, setEdgeActive } = appStore;

	const [active, setActive] = useState<boolean>(true);
	const [rotation, setRotation] = useState<number>(0);

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
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={active}
				styles={{
					top: 50,
				}}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Start;
