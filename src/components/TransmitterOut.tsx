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
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const TransmitterOut: React.FC<Props> = observer(({ id }) => {
	const { activeEdges, setRemoteConnectionValues, nodesData } = appStore;

	const { remote } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const { prevEdgeIds } = GetEdges(id, {
		prev: true,
		next: false,
	});

	const active: boolean | null = useMemo(
		() => prevEdgeIds[0] !== undefined && activeEdges[prevEdgeIds[0]],
		[activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		setRemoteConnectionValues(remote?.id as number, 'out', active);

		return () => {
			setRemoteConnectionValues(remote?.id as number, 'out', false);
		};
	}, [remote?.id, active, setRemoteConnectionValues]);

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
					<Title style={{ margin: 0 }}>
						<LogoutOutlined />
					</Title>
					<RemoteSelect
						nodeId={id}
						remote={remote}
					/>
				</Flex>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={active}
				nodeId={id}
			/>
		</Flex>
	);
});

export default TransmitterOut;
