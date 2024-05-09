import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../../utils/appStore';
import { Flex } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import GetEdges from '../../utils/getEdges';
import GetNodeParameters from '../../utils/getNodeParameters';

interface Props {
	id: string;
}

const Switch: React.FC<Props> = observer(({ id }) => {
	const { activeEdges, setEdgeActive, setNodeParameters, nodesData } = appStore;

	const { rotation, active } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const toggleSwitch = useCallback(
		() => setNodeParameters(id, { active: !active }),
		[setNodeParameters, active, id]
	);

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	const incoming: boolean | null = useMemo(
		() => (prevEdgeIds[0] ? activeEdges[prevEdgeIds[0]] : null),
		// eslint-disable-next-line
		[activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		nextEdgeIds[0] &&
			setEdgeActive(nextEdgeIds[0], (incoming && active) || false);
	}, [prevEdgeIds, nextEdgeIds, setEdgeActive, incoming, active]);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>
				<MinusOutlined
					onClick={toggleSwitch}
					style={{ rotate: `${rotation || 0 + (active ? 0 : 90)}deg` }}
				/>
			</Title>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
				nodeId={id}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={(incoming && active) || false}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Switch;
