import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore, { defaultNodeData } from '../../utils/appStore';
import { Flex, Switch } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import NodeUtils from '../NodeUtils';
import Connector from '../Connector';
import { nodeTypes } from '../../utils/types';

interface Props {
	id: string;
}

const Start: React.FC<Props> = observer(({ id }) => {
	const { setNodeData, nodesData } = appStore;

	const { output, rotation } =useMemo(
		() => (Object.hasOwn(nodeTypes, id) ? defaultNodeData : nodesData[id]),
		[nodesData, id]
	);


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
