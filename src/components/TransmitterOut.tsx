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
import { LogoutOutlined } from '@ant-design/icons';
import RemoteSelect from './RemoteSelect';

interface Props {
	id: string;
	data: {
		rotation: number;
		remoteId: number;
	};
}

const TransmitterOut: React.FC<Props> = observer(({ id, data }) => {
	const { activeEdges, setRemoteConnectionValues } = appStore;

	const { rotation, remoteId } = data;

	const { prevEdgeIds } = GetEdges(id, {
		prev: true,
		next: false,
	});

	const active: boolean | null = useMemo(
		() => prevEdgeIds[0] !== undefined && activeEdges[prevEdgeIds[0]],
		[activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		setRemoteConnectionValues(remoteId, 'out', active);

		return () => setRemoteConnectionValues(remoteId, 'out', active);
	}, [remoteId, active, setRemoteConnectionValues]);

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
				<Flex
					vertical
					align='center'
				>
					<Title style={{ color: '#000', margin: 0 }}>
						<LogoutOutlined />
					</Title>
					<RemoteSelect
						nodeId={id}
						remoteId={remoteId}
					/>
				</Flex>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default TransmitterOut;
