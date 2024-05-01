import {
	ArrowRightOutlined,
	CloseOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback, useMemo } from 'react';
import { Node } from 'reactflow';
import { Flex } from 'antd';

interface Props {
	id: string;
}

const NodeUtils: React.FC<Props> = observer(({ id }) => {
	const { setNodeParameters, nodes, removeNode } = appStore;

	const node: Node<any, string | undefined> | undefined = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const rotation = useMemo(() => node?.data?.rotation, [node]);

	const handleNodeRotation = useCallback(
		(right: boolean) => {
			let newRotation: number = (rotation + (right ? 90 : -90)) % 360;
			if (newRotation === -90) newRotation = 270;
			setNodeParameters(node, { rotation: newRotation });
		},
		[setNodeParameters, node, rotation]
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
