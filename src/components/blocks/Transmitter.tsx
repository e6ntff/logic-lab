import { observer } from 'mobx-react-lite';
import { Position } from 'reactflow';
import { blockStyle } from '../../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore, { defaultNodeData } from '../../utils/appStore';
import { Flex, Segmented } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import RemoteSelect from '../RemoteSelect';
import { SegmentedLabeledOption } from 'antd/es/segmented';
import { icons, nodeTypes } from '../../utils/types';

interface Props {
	id: string;
}

const Transmitter: React.FC<Props> = observer(({ id }) => {
	const {
		remoteConnections,
		setNodeData,
		removeEdges,
		setRemoteConnectionValues,
		nodesData,
	} = appStore;

	const { remote, rotation, prevNodeIds } = useMemo(
		() => (Object.hasOwn(nodeTypes, id) ? defaultNodeData : nodesData[id]),
		[nodesData, id]
	);

	const output: boolean = useMemo(
		() =>
			remote?.type === 'in'
				? nodesData[prevNodeIds[0]]?.output || false
				: remoteConnections[remote?.id as number]?.in,
		// eslint-disable-next-line
		[remoteConnections, remote, prevNodeIds, nodesData[prevNodeIds[0]]]
	);

	useEffect(() => {
		remote?.type === 'out' && setNodeData(id, { output });

		remote?.type === 'in' &&
			setRemoteConnectionValues(remote?.id as number, 'out', output);

		return () => {
			setRemoteConnectionValues(remote?.id as number, 'out', false);
		};
	}, [id, output, setNodeData, setRemoteConnectionValues, remote]);

	const options: SegmentedLabeledOption<'in' | 'out'>[] = useMemo(
		() => [
			{ value: 'in', label: <LoginOutlined /> },
			{ value: 'out', label: <LogoutOutlined /> },
		],
		[]
	);

	const handleTypeChanging = useCallback(
		(type: 'in' | 'out') => {
			setNodeData(id, { remote: { ...remote, type } });
			type === 'in' && removeEdges(id, false, true);
			type === 'out' && removeEdges(id, true, false);
		},
		[setNodeData, removeEdges, id, remote]
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
				<Title style={{ margin: 0 }}>{icons.transmitter}</Title>
				<RemoteSelect
					nodeId={id}
					remote={remote}
				/>
			</Flex>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			{remote?.type === 'in' && (
				<Connector
					id='a'
					type='target'
					position={'left' as Position}
					active={output}
					nodeId={id}
					rotation={rotation}
				/>
			)}
			{remote?.type === 'out' && (
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

export default Transmitter;
