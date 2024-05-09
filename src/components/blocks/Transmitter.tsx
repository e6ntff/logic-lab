import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../../utils/appStore';
import { Flex, Segmented } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import GetEdges from '../../utils/getEdges';
import { LoginOutlined, LogoutOutlined, WifiOutlined } from '@ant-design/icons';
import RemoteSelect from '../RemoteSelect';
import GetNodeParameters from '../../utils/getNodeParameters';
import { SegmentedLabeledOption } from 'antd/es/segmented';

interface Props {
	id: string;
}

const Transmitter: React.FC<Props> = observer(({ id }) => {
	const {
		setEdgeActive,
		remoteConnections,
		nodesData,
		setNodeParameters,
		removeEdge,
		activeEdges,
		setRemoteConnectionValues,
	} = appStore;

	const { remote } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const { prevEdgeIds, nextEdgeIds } = GetEdges(id, {
		prev: true,
		next: true,
	});

	const active: boolean | null = useMemo(
		() =>
			remote?.type === 'in'
				? prevEdgeIds[0] !== undefined && activeEdges[prevEdgeIds[0]]
				: remoteConnections[remote?.id as number]?.in,
		// eslint-disable-next-line
		[remoteConnections, remote?.id, remote?.type, activeEdges, prevEdgeIds]
	);

	useEffect(() => {
		remote?.type === 'out' && setEdgeActive(nextEdgeIds[0], active || false);

		remote?.type === 'in' &&
			setRemoteConnectionValues(remote?.id as number, 'out', active);

		return () => {
			setRemoteConnectionValues(remote?.id as number, 'out', false);
		};
	}, [
		nextEdgeIds,
		active,
		setEdgeActive,
		setRemoteConnectionValues,
		remote?.id,
		remote?.type,
	]);

	useEffect(() => {}, [remote?.id, active, setRemoteConnectionValues]);

	const options: SegmentedLabeledOption<'in' | 'out'>[] = useMemo(
		() => [
			{ value: 'in', label: <LoginOutlined /> },
			{ value: 'out', label: <LogoutOutlined /> },
		],
		[]
	);

	const handleTypeChanging = useCallback(
		(type: 'in' | 'out') => {
			setNodeParameters(id, { remote: { ...remote, type } });
			type === 'in' && removeEdge(nextEdgeIds[0]);
			type === 'out' && removeEdge(prevEdgeIds[0]);
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
					options={options}
					onChange={handleTypeChanging}
				/>
				<Title style={{ margin: 0 }}>
					<WifiOutlined />
				</Title>
				<RemoteSelect
					nodeId={id}
					remote={remote}
				/>
			</Flex>
			<NodeUtils id={id} />
			{remote?.type === 'in' && (
				<Connector
					id='a'
					type='target'
					position={'left' as Position}
					active={active}
					nodeId={id}
				/>
			)}
			{remote?.type === 'out' && (
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

export default Transmitter;
