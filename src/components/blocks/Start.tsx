import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Flex, Switch } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { NodeData } from '../../utils/interfaces';

interface Props {
	id: string;
	data: NodeData;
}

const Start: React.FC<Props> = observer(({ id, data }) => {
	const { setNodeData } = appStore;

	const { output, rotation } = useMemo(() => data, [data]);

	useEffect(() => {
		setNodeData(id, { output });
	}, [setNodeData, output, id]);

	const handleSwitchChange = useCallback(
		(active: boolean) => setNodeData(id, { output: active }),
		[setNodeData, id]
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
				active={output || false}
				nodeId={id}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Start;
