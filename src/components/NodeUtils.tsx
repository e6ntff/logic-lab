import {
	ArrowRightOutlined,
	CloseOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import { Node } from 'reactflow';

interface Props {
	id: string;
	setRotation: Dispatch<SetStateAction<number>>;
}

const NodeUtils: React.FC<Props> = observer(({ id, setRotation }) => {
	const { rotateNode, nodes, removeNode } = appStore;

	const rotation: number = useMemo(
		() =>
			nodes.find((node: Node<any, string | undefined>) => node.id === id)?.data
				?.rotate,
		[nodes, id]
	);

	useEffect(() => {
		setRotation(rotation);
	}, [rotation, setRotation, id]);

	const handleNodeRotation = useCallback(
		(right: boolean) => {
			let newRotation: number = (rotation + (right ? 90 : -90)) % 360;
			if (newRotation === -90) newRotation = 270;
			rotateNode(id, newRotation);
		},
		[rotateNode, id, rotation]
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
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={() => removeNode(id)}
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
