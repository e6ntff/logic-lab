import { observer } from 'mobx-react-lite';
import { blockStyleSmall } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Progress, Typography } from 'antd';
import {
	CloseOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Position } from 'reactflow';
import Connector from './Connector';
import RotationPanel from './RotationPanel';

interface Props {
	id: string;
	data: { delay: number; rotate: number };
}

const Delay: React.FC<Props> = observer(({ id, data }) => {
	const { removeNode, edges, setEdgeActive, activeEdges, changeDelay } =
		appStore;
	const { delay } = data;

	const [active, setActive] = useState<boolean>(false);
	const [percent, setPercent] = useState<number>(0);
	const [rotation, setRotation] = useState<number>(0);

	const handleDelayChange = useCallback(
		(diff: number) => {
			const newDelay = delay + diff;
			if (newDelay > 10000 || newDelay < 100) return;
			changeDelay(id, newDelay);
		},
		[changeDelay, delay, id]
	);

	const [prevEdgeId, nextEdgeId]: (string | undefined)[] = useMemo(
		() => [
			edges.find((edge: Edge<any>) => edge.target === id)?.id,
			edges.find((edge: Edge<any>) => edge.source === id)?.id,
		],
		[edges, id]
	);

	const incoming: boolean | null = useMemo(() => {
		try {
			return prevEdgeId ? activeEdges[prevEdgeId] : null;
		} catch (error) {
			return false;
		}
		// eslint-disable-next-line
	}, [activeEdges[prevEdgeId as string]]);

	useEffect(() => {
		const timerId = setTimeout(() => setActive(incoming || false), delay);
		const percentId = setInterval(
			() =>
				setPercent((prev: number) => {
					const percent = prev + (incoming ? 1 : -1);
					if (percent < 0) return prev;
					if (percent > 100) return prev;
					return percent;
				}),
			delay / 100
		);

		return () => {
			clearTimeout(timerId);
			clearInterval(percentId);
		};
	}, [incoming, delay]);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	useEffect(() => {
		try {
			if (!nextEdgeId) return;
			const outgoing = active;
			setEdgeActive(nextEdgeId, outgoing);
		} catch (error) {}
	}, [setEdgeActive, id, nextEdgeId, active]);

	return (
		<Flex
			vertical
			style={blockStyleSmall}
			justify='space-around'
			align='center'
		>
			<Progress
				showInfo={false}
				percent={percent}
				strokeColor='#f00'
				trailColor='#aaa'
			/>
			<Flex
				align='center'
				gap={4}
			>
				<MinusCircleOutlined onClick={() => handleDelayChange(-100)} />
				<PlusCircleOutlined onClick={() => handleDelayChange(100)} />
				<Typography.Text>
					{(Math.floor(delay / 100) / 10).toFixed(1)}
				</Typography.Text>
			</Flex>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
			<Connector
				id='a'
				type='target'
				position={'left' as Position}
				active={incoming}
				styles={{
					top: '50%',
				}}
				rotation={rotation}
			/>
			<Connector
				id='b'
				type='source'
				position={'right' as Position}
				active={active}
				styles={{
					top: '50%',
				}}
				rotation={rotation}
			/>
		</Flex>
	);
});

export default Delay;
