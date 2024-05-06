import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import NodeUtils from './NodeUtils';
import Connector from './Connector';
import GetEdges from '../utils/getEdges';
import { LoginOutlined } from '@ant-design/icons';
import RemoteSelect from './RemoteSelect';
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const TransmitterIn: React.FC<Props> = observer(({ id }) => {
	const { setEdgeActive, remoteConnections, nodesData } = appStore;

	const { remote } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);
	const { nextEdgeIds } = GetEdges(id, {
		prev: false,
		next: true,
	});

	const active: boolean | null = useMemo(() => {
		return remoteConnections[remote?.id as number]?.in;
	}, [remoteConnections, remote?.id]);

	useEffect(() => {
		setEdgeActive(nextEdgeIds[0], active || false);
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
					<LoginOutlined />
				</Title>
				<RemoteSelect
					nodeId={id}
					remoteId={remote?.id as number}
					type='in'
				/>
			</Flex>
			<NodeUtils id={id} />
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

export default TransmitterIn;
