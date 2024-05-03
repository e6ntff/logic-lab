import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch } from 'antd';
import { useCallback, useEffect } from 'react';
import { Position } from 'reactflow';
import NodeUtils from './NodeUtils';
import Connector from './Connector';
import GetEdges from '../utils/getEdges';

interface Props {
	id: string;
	data: { rotation: number; active: boolean };
}

const Start: React.FC<Props> = observer(({ id, data }) => {
	const { setEdgeActive, setNodeParameters } = appStore;

	const { rotation, active } = data;

	const { nextEdgeIds } = GetEdges(id, { prev: false, next: true });

	useEffect(() => {
		try {
			nextEdgeIds.forEach((id: string) => {
				setEdgeActive(id, active);
			});
		} catch (error) {}
	}, [setEdgeActive, id, nextEdgeIds, active]);

	const handleSwitchChange = useCallback(
		(active: boolean) => setNodeParameters(id, { active: active }),
		[setNodeParameters, id]
	);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Switch
				onChange={handleSwitchChange}
				value={active}
			/>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Start;
