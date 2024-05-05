import { observer } from 'mobx-react-lite';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	Node,
	SelectionMode,
	Viewport,
	useOnViewportChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { edgeTypes, nodeTypes } from './utils/types';
import appStore from './utils/appStore';
import Panel from './components/Panel';
import MessageButton from './components/MessageButton';
import FpsScreen from './components/FpsScreen';
import React, { useCallback, useEffect } from 'react';
import getNodes from './utils/getNodes';
import { Flex, Progress } from 'antd';

const App: React.FC = observer(() => {
	const {
		loading,
		nodes,
		edges,
		updateNodes,
		updateEdges,
		updateConnections,
		removeNode,
		viewport,
	} = appStore;

	const handleNodesDeleting = useCallback(
		(nodes: Node<any, string | undefined>[]) =>
			nodes.forEach(({ id }: Node<any, string | undefined>) => removeNode(id)),
		[removeNode]
	);

	useEffect(() => {
		getNodes();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{loading < 1 && (
				<Flex
					vertical
					gap={16}
					justify='center'
					align='center'
					style={{
						zIndex: 99999,
						background: '#fff',
						inlineSize: '100%',
						blockSize: '100%',
						position: 'absolute',
						inset: 0,
					}}
				>
					<Progress
						type='circle'
						percent={loading * 100}
						format={(value: number | undefined) => (
							<>{`${Math.round(value || 0)}%`}</>
						)}
					/>
				</Flex>
			)}
			<Panel />
			<ReactFlow
				defaultViewport={viewport}
				minZoom={0.01}
				snapToGrid
				snapGrid={[30, 30]}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={updateNodes}
				onEdgesChange={updateEdges}
				onConnect={updateConnections}
				onNodesDelete={handleNodesDeleting}
				nodes={nodes}
				edges={edges}
				selectionMode={SelectionMode.Partial}
			>
				<ViewportChangeHandler />
				<Background
					gap={[30, 30]}
					variant={BackgroundVariant.Lines}
				/>
				<Controls />
				<MiniMap
					position={'top-right'}
					inversePan
					pannable
					zoomable
					zoomStep={1.25}
				/>
			</ReactFlow>
			<MessageButton />
			<FpsScreen />
		</>
	);
});

export default App;

const ViewportChangeHandler: React.FC = observer(() => {
	const { setViewport } = appStore;

	const save = useCallback(
		(viewport: Viewport) => {
			sessionStorage.setItem('viewport', JSON.stringify(viewport));
			setViewport(viewport);
		},
		[setViewport]
	);

	useOnViewportChange({
		onEnd: save,
	});

	return null;
});
