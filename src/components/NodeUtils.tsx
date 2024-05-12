import {
	ArrowRightOutlined,
	CloseOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback } from 'react';
import { Flex } from 'antd';

interface Props {
	id: string;
	rotation: number;
}

const NodeUtils: React.FC<Props> = observer(({ id, rotation }) => {
	const { setNodeData, removeNode } = appStore;

	const handleNodeRotation = useCallback(
		(right: boolean) => {
			let newRotation: number = ((rotation || 0) + (right ? 90 : -90)) % 360;
			if (newRotation === -90) newRotation = 270;
			setNodeData(id, { rotation: newRotation });
		},
		[setNodeData, id, rotation]
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
