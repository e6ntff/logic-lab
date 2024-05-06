import { Flex, Radio, RadioChangeEvent } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback } from 'react';

interface Props {
	nodeId: string;
	remoteId: number;
	type?: 'in' | 'out';
}

const RemoteSelect: React.FC<Props> = observer(({ nodeId, remoteId, type }) => {
	const { setNodeParameters, remoteConnections } = appStore;

	const handleRemoteIdChange = useCallback(
		(event: RadioChangeEvent) =>
			type &&
			setNodeParameters(nodeId, { remote: { type, id: event.target.value } }),
		[setNodeParameters, nodeId, type]
	);

	return (
		<Flex
			vertical
			align='center'
			gap={4}
		>
			<Radio.Group
				onChange={handleRemoteIdChange}
				value={remoteId}
			>
				<Flex
					justify='center'
					gap={4}
				>
					{new Array(5).fill(null).map((_: null, index: number) => (
						<Radio
							disabled={
								type
									? remoteConnections.used[type].includes(index) &&
									  index !== remoteId
									: false
							}
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
