import { observer } from 'mobx-react-lite';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Edge,
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
import { Flex, Progress } from 'antd';
import { NodeData, RemoteUsed } from './utils/interfaces';
import getNodes from './utils/getNodes';

const App: React.FC = observer(() => {
	const {
		loading,
		nodes,
		edges,
		nodesData,
		updateNodes,
		updateEdges,
		updateConnections,
		removeNode,
		removeEdge,
		viewport,
		setRemoteConnectionUsed,
		flow,
		setFlow,
	} = appStore;

	const handleNodesDeleting = useCallback(
		(nodes: Node<NodeData>[]) =>
			nodes.forEach(({ id }: Node<NodeData>) => removeNode(id)),
		[removeNode]
	);

	const handleEdgesDeleting = useCallback(
		(edges: Edge<any>[]) => edges.forEach((edge: Edge) => removeEdge(edge)),
		[removeEdge]
	);

	useEffect(() => {
		getNodes();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const used: RemoteUsed = {
			in: [],
			out: [],
			receiver: [],
		};
		Object.keys(nodesData).forEach((key: string) => {
			const remote = nodesData[key].remote;
			if (remote?.id === null || !remote) return;
			if (remote?.type) {
				used[remote.type].push(remote.id);
			} else {
				used.receiver.push(remote.id);
			}
		});
		setRemoteConnectionUsed(used);
	}, [setRemoteConnectionUsed, nodesData]);

	useEffect(() => {
		flow?.setViewport(viewport);
	}, [viewport, flow]);

	return (
		<>
			{loading < 1 && <Preloader loading={loading} />}
			<Panel />
			<ReactFlow
				onInit={setFlow}
				defaultViewport={viewport}
				minZoom={0.1}
				maxZoom={1}
				snapToGrid
				snapGrid={[35, 35]}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={updateNodes}
				onEdgesChange={updateEdges}
				onConnect={updateConnections}
				onNodesDelete={handleNodesDeleting}
				onEdgesDelete={handleEdgesDeleting}
				nodes={nodes}
				edges={edges}
				noDragClassName='noDrag'
				selectionMode={SelectionMode.Partial}
				translateExtent={[
					[-10000, -10000],
					[10000, 10000],
				]}
				nodeExtent={[
					[-10000, -10000],
					[10000, 10000],
				]}
			>
				<ViewportChangeHandler />
				<Background
					id='0'
					gap={[140, 140]}
					lineWidth={3}
					variant={BackgroundVariant.Lines}
				/>
				<Background
					id='1'
					gap={[35, 35]}
					variant={BackgroundVariant.Lines}
				/>
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
			setViewport(viewport);
		},
		[setViewport]
	);

	useOnViewportChange({
		onChange: save,
	});

	return null;
});

interface PreloaderProps {
	loading: number;
}

const Preloader: React.FC<PreloaderProps> = ({ loading }) => (
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
);
