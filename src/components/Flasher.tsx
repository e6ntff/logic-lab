import { observer } from 'mobx-react-lite';
import { blockStyleSmall, connectorStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch, Typography } from 'antd';
import {
	CloseOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Handle, Position } from 'reactflow';

interface Props {
	id: string;
}

const Flasher: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, setEdgeActive } = appStore;

	const [delay, setDelay] = useState<number>(1000);

	const [active, setActive] = useState<boolean>(true);

	const handleDelayChange = useCallback(
		(diff: number) => {
			setDelay((prevDelay: number) => {
				const delay = prevDelay + diff;
				if (delay > 10000 || delay < 100) return prevDelay;
				return delay;
			});
		},
		[setDelay]
	);

	useEffect(() => {
		const timerId = setInterval(
			() => setActive((prev: boolean) => !prev),
			delay
		);

		return () => clearInterval(timerId);
	}, [delay]);

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const nextEdgeId: string | undefined = useMemo(
		() => edges.find((edge: Edge<any>) => edge.source === id)?.id,
		[edges, id]
	);

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
			justify='space-between'
			align='center'
		>
			<Switch
				value={active}
				disabled
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
			<Handle
				id='a'
				type='source'
				position={'right' as Position}
				style={{
					top: '50%',
					...connectorStyle,
					background: active ? '#f00' : '#000',
				}}
			/>
		</Flex>
	);
});

export default Flasher;
