import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { useEffect, useMemo } from 'react';
import NodeUtils from './NodeUtils';
import Connector from './Connector';
import GetEdges from '../utils/getEdges';
import RemoteSelect from './RemoteSelect';
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const Receiver: React.FC<Props> = observer(({ id }) => {
	const {
		setEdgeActive,
		activeEdges,
		remoteConnections,
		setRemoteConnectionValues,
		nodesData,
	} = appStore;

	const { remoteId } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, {
		prev: true,
		next: true,
	});

	const incoming: boolean = useMemo(
		() => prevEdgeIds[0] !== undefined && activeEdges[prevEdgeIds[0]],
		[activeEdges, prevEdgeIds]
	);

	const active: boolean = useMemo(() => {
		return remoteConnections[remoteId as number]?.out;
	}, [remoteConnections, remoteId]);

	useEffect(() => {
		setRemoteConnectionValues(remoteId as number, 'in', incoming);

		return () => setRemoteConnectionValues(remoteId as number, 'in', incoming);
	}, [remoteId, incoming, setRemoteConnectionValues]);

	useEffect(() => {
		setEdgeActive(nextEdgeIds[0], active);
	}, [nextEdgeIds, active, setEdgeActive]);

	return (
		<Flex
			style={{ ...blockStyle }}
			justify='center'
			align='center'
		>
			<Flex
				vertical
				align='center'
			>
				<Title style={{ margin: 0 }}>
					<ApiOutlined />
				</Title>
				<RemoteSelect
					nodeId={id}
					remoteId={remoteId as number}
				/>
			</Flex>
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
				active={active}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Receiver;
