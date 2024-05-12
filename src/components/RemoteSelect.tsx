import { Flex, Radio, RadioChangeEvent } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback } from 'react';
import { NodeData } from '../utils/interfaces';

interface Props {
	nodeId: string;
	remote: NodeData['remote'];
}

const RemoteSelect: React.FC<Props> = observer(({ nodeId, remote }) => {
	const { setNodeData, remoteConnections } = appStore;

	const { type, id } = remote;

	const handleRemoteIdChange = useCallback(
		(event: RadioChangeEvent) => {
			const value = event.target.value;
			if (value === undefined) return;
			setNodeData(nodeId, { remote: { type, id: value } });
		},
		[setNodeData, nodeId, type]
	);

	const getIsButtonDisabled = useCallback(
		(index: number) => {
			if (index === id) return false;
			return type
				? remoteConnections.used[type].includes(index)
				: remoteConnections.used.receiver.includes(index);
		},
		[type, id, remoteConnections.used]
	);

	return (
		<Flex
			vertical
			align='center'
			gap={4}
		>
			<Radio.Group
				onChange={handleRemoteIdChange}
				value={id}
			>
				<Flex
					justify='center'
					gap={4}
				>
					{new Array(5).fill(null).map((_: null, index: number) => (
						<Radio
							disabled={getIsButtonDisabled(index)}
							key={index}
							style={{ margin: 0 }}
							value={index}
						/>
					))}
				</Flex>
			</Radio.Group>
		</Flex>
	);
});

export default RemoteSelect;
