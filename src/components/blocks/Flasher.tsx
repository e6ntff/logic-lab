import { observer } from 'mobx-react-lite';
import { blockStyle } from '../../utils/blockStyles';
import appStore from '../../utils/appStore';
import { Divider, Flex, Switch } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import Connector from '../Connector';
import NodeUtils from '../NodeUtils';
import GetEdges from '../../utils/getEdges';
import getNodeParameters from '../../utils/getNodeParameters';
import TimeRange from '../TimeRange';

interface Props {
	id: string;
}

const Flasher: React.FC<Props> = observer(({ id }) => {
	const { setEdgeActive, setNodeParameters, nodesData } = appStore;

	const { plusDelay, minusDelay, active } = useMemo(
		() => getNodeParameters(id),
		// eslint-disable-next-line
		[nodesData[id]]
	);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (active)
			timerId = setTimeout(
				() => setNodeParameters(id, { active: false }),
				plusDelay
			);

		return () => clearTimeout(timerId);
	}, [plusDelay, active, setNodeParameters, id]);

	useEffect(() => {
		let timerId: NodeJS.Timer;
		if (!active)
			timerId = setTimeout(
				() => setNodeParameters(id, { active: true }),
				minusDelay
			);

		return () => clearTimeout(timerId);
	}, [minusDelay, active, setNodeParameters, id]);

	const { nextEdgeIds } = GetEdges(id, { prev: true, next: true });

	useEffect(() => {
		nextEdgeIds[0] && setEdgeActive(nextEdgeIds[0], active || false);
	}, [setEdgeActive, id, nextEdgeIds, active]);

	const handlePlusDelayChange = useCallback(
		(diff: number) => {
			let newDelay = (plusDelay || 0) + diff;
			if (newDelay > 10000) newDelay = 10000;
			if (newDelay < 100) newDelay = 100;
			setNodeParameters(id, { plusDelay: newDelay });
		},
		[setNodeParameters, plusDelay, id]
	);

	const handleMinusDelayChange = useCallback(
		(diff: number) => {
			let newDelay = (minusDelay || 0) + diff;
			if (newDelay > 10000) newDelay = 10000;
			if (newDelay < 100) newDelay = 100;
			setNodeParameters(id, { minusDelay: newDelay });
		},
		[setNodeParameters, minusDelay, id]
	);

	return (
		<Flex
			vertical
			style={blockStyle}
			justify='space-around'
			align='center'
		>
			<Switch
				value={active}
				disabled
			/>
			<Flex
				vertical
				gap={4}
				style={{ inlineSize: '100%' }}
			>
				<TimeRange
					value={plusDelay}
					id={id}
					onChange={handlePlusDelayChange}
				/>
				<Divider style={{ margin: 0 }} />
				<TimeRange
					value={minusDelay}
					id={id}
					onChange={handleMinusDelayChange}
				/>
			</Flex>
			<NodeUtils id={id} />
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={active || false}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Flasher;
