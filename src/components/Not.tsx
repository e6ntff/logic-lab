import { observer } from 'mobx-react-lite';
import { Edge, Handle, Position } from 'reactflow';
import { connectorStyle, notStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo } from 'react';

interface Props {
	id: string;
}

const Not: React.FC<Props> = observer(({ id }) => {
	const { removeNode, edges, nodeSignals, addNodeSignal, setEdgeActive } =
		appStore;

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const [prevNodeId, prevEdgeId]: string[] = useMemo(() => {
		const check = (edge: Edge<any>) => edge.target === id;
		const node = edges.find(check)?.source || '';
		const edge = edges.find(check)?.id || '';
		return [node, edge];
	}, [edges, id]);

	useEffect(() => {
		if (!prevNodeId) return;
		try {
			const input: boolean = nodeSignals[prevNodeId]?.output || false;
			const output = !input;
			addNodeSignal(id, input, output);
			setEdgeActive(prevEdgeId, input);
		} catch (error) {}
		// eslint-disable-next-line
	}, [
		prevNodeId,
		// eslint-disable-next-line
		nodeSignals[prevNodeId as string],
		addNodeSignal,
		id,
	]);

	return (
		<Flex
			style={notStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#000', margin: 0 }}>NOT</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='target'
				position={'left' as Position}
				style={{
					top: '50%',
					...connectorStyle,
				}}
			/>

			<Handle
				id='b'
				type='source'
				position={'right' as Position}
				style={{ top: '50%', ...connectorStyle }}
			/>
		</Flex>
	);
});

export default Not;
