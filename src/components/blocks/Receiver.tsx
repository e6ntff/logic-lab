import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../../utils/appStore';
import { Flex, Segmented } from 'antd';
import { ApiOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import GetEdges from '../../utils/getEdges';
import RemoteSelect from '../RemoteSelect';
import GetNodeParameters from '../../utils/getNodeParameters';
import { SegmentedLabeledOption } from 'antd/es/segmented';

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
		setNodeParameters,
		removeEdge,
	} = appStore;

	const { remote, mode } = useMemo(
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
		return remoteConnections[remote?.id as number]?.out;
	}, [remoteConnections, remote?.id]);

	useEffect(() => {
		setRemoteConnectionValues(remote?.id as number, 'in', incoming);

		return () => setRemoteConnectionValues(remote?.id as number, 'in', false);
	}, [remote?.id, incoming, setRemoteConnectionValues]);

	useEffect(() => {
		setEdgeActive(nextEdgeIds[0], active);
	}, [nextEdgeIds, active, setEdgeActive]);

	const options: SegmentedLabeledOption<'in' | 'out' | 'all'>[] = useMemo(
		() => [
			{ value: 'in', label: <LoginOutlined /> },
			{ value: 'all', label: <ApiOutlined /> },
			{ value: 'out', label: <LogoutOutlined /> },
		],
		[]
	);

	const handleModeChanging = useCallback(
		(mode: 'in' | 'out' | 'all') => {
			setNodeParameters(id, { mode });
			mode === 'in' && removeEdge(nextEdgeIds[0]);
			mode === 'out' && removeEdge(prevEdgeIds[0]);
		},
		// eslint-disable-next-line
		[setNodeParameters, id, removeEdge, prevEdgeIds[0], nextEdgeIds[0]]
	);

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
				<Segmented
					value={mode}
					onChange={handleModeChanging}
					options={options}
					size='small'
				/>
				<Title style={{ margin: 0 }}>
					<ApiOutlined />
				</Title>
				<RemoteSelect
					nodeId={id}
					remote={remote}
				/>
			</Flex>
			<NodeUtils id={id} />
			{!(mode === 'out') && (
				<Connector
					id='a'
					type='target'
					position={'left' as Position}
					active={incoming}
					nodeId={id}
				/>
			)}
			{!(mode === 'in') && (
				<Connector
					id='b'
					type='source'
					position={'right' as Position}
					active={active}
					nodeId={id}
				/>
			)}
		</Flex>
	);
});

export default Receiver;
