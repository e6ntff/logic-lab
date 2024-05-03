import { Flex, Radio } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Props {
	nodeId: string;
	remoteId: number;
}

const RemoteSelect: React.FC<Props> = observer(({ nodeId, remoteId }) => {
	const { setNodeParameters } = appStore;

	const handleRemoteIdChange = useCallback(
		(event: CheckboxChangeEvent) =>
			setNodeParameters(nodeId, { remoteId: event.target.value || 0 }),
		[setNodeParameters, nodeId]
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
