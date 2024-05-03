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

interface Props {
	id: string;
	data: {
		rotation: number;
		remoteId: number;
	};
}

const Receiver: React.FC<Props> = observer(({ id, data }) => {
	const {
		setEdgeActive,
		activeEdges,
		remoteConnections,
		setRemoteConnectionValues,
	} = appStore;

	const { rotation, remoteId } = data;

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, {
		prev: true,
		next: true,
	});

	const incoming: boolean = useMemo(
		() => prevEdgeIds[0] !== undefined && activeEdges[prevEdgeIds[0]],
		[activeEdges, prevEdgeIds]
	);

	const active: boolean = useMemo(() => {
		return remoteConnections[remoteId]?.out;
	}, [remoteConnections, remoteId]);

	useEffect(() => {
		setRemoteConnectionValues(remoteId, 'in', incoming);

		return () => setRemoteConnectionValues(remoteId, 'in', incoming);
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
				<Title style={{ color: '#000', margin: 0 }}>
					<ApiOutlined />
				</Title>
				<RemoteSelect
					nodeId={id}
					remoteId={remoteId}
				/>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
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

export default Receiver;
