import { observer } from 'mobx-react-lite';
import { Edge, Handle, Position } from 'reactflow';
import { connectorStyle, orStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';

interface Props {
	id: string;
}

const Or: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, nodeSignals, addNodeSignal, setEdgeActive } =
		appStore;

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const [prevNodeIds, prevEdgeIds]: string[][] = useMemo(() => {
		const check = (edge: Edge<any>) => edge.target === id;
		const prevNodes: string[] = edges
			.filter(check)
			.map((edge: Edge<any>) => edge.source || '');
		const prevEdges: string[] = edges
			.filter(check)
			.map((edge: Edge<any>) => edge.id || '');
		return [prevNodes, prevEdges];
	}, [edges, id]);

	useEffect(() => {
		if (prevNodeIds.some((id: string | null) => id === '')) return;
		if (prevNodeIds[0] === prevNodeIds[1]) return;
		if (prevNodeIds.length !== 2) return;
		try {
			const inputs: [boolean, boolean] = [
				nodeSignals[prevNodeIds[0]]?.output || false,
				nodeSignals[prevNodeIds[1]]?.output || false,
			];
			const output = inputs[0] || inputs[1];
			addNodeSignal(id, inputs, output);
			prevEdgeIds.forEach((id: string, index: number) =>
				setEdgeActive(id, inputs[index])
			);
		} catch (error) {}
		// eslint-disable-next-line
	}, [
		prevNodeIds,
		// eslint-disable-next-line
		nodeSignals[prevNodeIds[0]],
		// eslint-disable-next-line
		nodeSignals[prevNodeIds[1]],
		addNodeSignal,
		id,
	]);

	return (
		<Flex
			style={orStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>OR</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='target'
				position={'left' as Position}
				style={{
					top: '33.3%',
					bottom: '66.6%',
					...connectorStyle,
				}}
			/>
			<Handle
				id='b'
				type='target'
				position={'left' as Position}
				style={{
					top: '66.6%',
					bottom: '33.3%',
					...connectorStyle,
				}}
			/>
			<Handle
				id='c'
				type='source'
				position={'right' as Position}
				style={{ top: '50%', ...connectorStyle }}
			/>
		</Flex>
	);
});

export default Or;
