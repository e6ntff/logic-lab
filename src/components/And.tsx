import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from './Connector';
import RotationPanel from './NodeUtils';
import GetEdges from '../utils/getEdges';

interface Props {
	id: string;
}

const And: React.FC<Props> = observer(({ id }) => {
	const { setEdgeActive, activeEdges } = appStore;

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	const active: boolean = useMemo(
		() =>
			prevEdgeIds.length > 0 &&
			prevEdgeIds.every((id: string) => activeEdges[id]),
		// eslint-disable-next-line
		[activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		nextEdgeIds[0] && setEdgeActive(nextEdgeIds[0], active || false);
	}, [prevEdgeIds, nextEdgeIds, active, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyle, background: '#f00' }}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#fff', margin: 0 }}>&</Title>
			<RotationPanel id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={active}
				nodeId={id}
				maxConnections={Infinity}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active}
				nodeId={id}
			/>
		</Flex>
	);
});

export default And;
