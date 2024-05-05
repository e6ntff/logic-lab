import {
	ArrowRightOutlined,
	CloseOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback, useMemo } from 'react';
import { Flex } from 'antd';
import GetNodeParameters from '../utils/getNodeParameters';

interface Props {
	id: string;
}

const NodeUtils: React.FC<Props> = observer(({ id }) => {
	const { setNodeParameters, removeNode, nodesData } = appStore;

	const { rotation } = useMemo(
		() => GetNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	const handleNodeRotation = useCallback(
		(right: boolean) => {
			let newRotation: number = ((rotation || 0) + (right ? 90 : -90)) % 360;
			if (newRotation === -90) newRotation = 270;
			setNodeParameters(id, { rotation: newRotation });
		},
		[setNodeParameters, id, rotation]
	);

	return (
		<Flex
			vertical
			style={{
				position: 'absolute',
				inset: 0,
				inlineSize: '100%',
				blockSize: '100%',
				padding: 10,
				boxSizing: 'border-box',
				pointerEvents: 'none',
			}}
			justify='space-between'
		>
			<Flex justify='space-between'>
				<ArrowRightOutlined
					style={{
						rotate: `${rotation}deg`,
					}}
				/>
				<CloseOutlined
					onClick={() => removeNode(id)}
					style={{ pointerEvents: 'all' }}
				/>
			</Flex>
			<Flex justify='space-between'>
				<RotateLeftOutlined
					onClick={() => handleNodeRotation(false)}
					style={{ pointerEvents: 'all' }}
				/>
				<RotateRightOutlined
					onClick={() => handleNodeRotation(true)}
					style={{ pointerEvents: 'all' }}
				/>
			</Flex>
		</Flex>
	);
});

export default NodeUtils;
