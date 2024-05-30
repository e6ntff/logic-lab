import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import { Flex, Switch } from 'antd';
import { useCallback, useMemo } from 'react';
import { Position } from 'reactflow';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { NodeData } from '../../utils/interfaces';
import useNodeSignal from '../../hooks/useNodeSignal';

interface Props {
	id: string;
	type: string;
	data: NodeData;
}

const Start: React.FC<Props> = observer(({ id, type, data }) => {
	const { rotation } = useMemo(() => data, [data]);

	const { setOutput, output } = useNodeSignal(id, data, type);

	const handleSwitchChange = useCallback(
		(active: boolean) => setOutput(active),
		[setOutput]
	);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Switch
				onChange={handleSwitchChange}
				value={output}
			/>
			<NodeUtils
				id={id}
				rotation={rotation}
			/>
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={output}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Start;
