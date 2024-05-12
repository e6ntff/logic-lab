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
import RemoteSelect from '../RemoteSelect';
import { SegmentedLabeledOption } from 'antd/es/segmented';
import { NodeData } from '../../utils/interfaces';

interface Props {
	id: string;
	data: NodeData;
}

const Receiver: React.FC<Props> = observer(({ id, data }) => {
	const {
		remoteConnections,
		setRemoteConnectionValues,
		setNodeData,
		removeEdges,
		nodes,
	} = appStore;

	const { remote, mode, rotation, prevNodeIds } = useMemo(() => data, [data]);

	const input: boolean = useMemo(
		() => nodes[prevNodeIds[0]]?.data?.output || false,
		[prevNodeIds, nodes]
	);

	const output: boolean = useMemo(() => {
		return remoteConnections[remote?.id as number]?.out;
	}, [remoteConnections, remote?.id]);

	useEffect(() => {
		setRemoteConnectionValues(remote?.id as number, 'in', input);

		return () => setRemoteConnectionValues(remote?.id as number, 'in', false);
	}, [remote?.id, input, setRemoteConnectionValues]);

	useEffect(() => {
		setNodeData(id, { output });
	}, [setNodeData, output, id]);

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
			setNodeData(id, { mode });
			mode === 'in' && removeEdges(id, false, true);
			mode === 'out' && removeEdges(id, true, false);
		},
		[setNodeData, id, removeEdges]
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
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			{!(mode === 'out') && (
				<Connector
					id='a'
					type='target'
					position={'left' as Position}
					active={input}
					nodeId={id}
					rotation={rotation}
				/>
			)}
			{!(mode === 'in') && (
				<Connector
					id='b'
					type='source'
					position={'right' as Position}
					active={output}
					nodeId={id}
					rotation={rotation}
				/>
			)}
		</Flex>
	);
});

export default Receiver;
