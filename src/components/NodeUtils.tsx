import {
	ArrowRightOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { useCallback, useMemo } from 'react';
import { Node } from 'reactflow';

interface Props {
	id: string;
}

const NodeUtils: React.FC<Props> = observer(({ id }) => {
	const { setNodeParameters, nodes } = appStore;

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
		<>
			<ArrowRightOutlined
				style={{
					position: 'absolute',
					top: 10,
					left: 10,
					rotate: `${rotation}deg`,
				}}
			/>
			<RotateRightOutlined
				onClick={() => handleNodeRotation(true)}
				style={{ position: 'absolute', bottom: 10, right: 10 }}
			/>
			<RotateLeftOutlined
				onClick={() => handleNodeRotation(false)}
				style={{ position: 'absolute', bottom: 10, left: 10 }}
			/>
		</>
	);
});

export default NodeUtils;
