import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import Connector from './Connector';
import NodeUtils from './NodeUtils';
import GetEdges from '../utils/getEdges';

interface Props {
	id: string;
	data: { rotation: number };
}

const Not: React.FC<Props> = observer(({ id, data }) => {
	const { activeEdges, setEdgeActive } = appStore;

	const { rotation } = data;

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	const active: boolean | null = useMemo(
		() => (prevEdgeIds[0] ? !activeEdges[prevEdgeIds[0]] : null),
		// eslint-disable-next-line
		[activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		nextEdgeIds[0] && setEdgeActive(nextEdgeIds[0], active || false);
	}, [prevEdgeIds, nextEdgeIds, setEdgeActive, active]);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>!</Title>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={!active && active !== null}
				rotation={rotation}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Not;
