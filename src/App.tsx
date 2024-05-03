import { observer } from 'mobx-react-lite';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { edgeTypes, nodeTypes } from './utils/types';
import appStore from './utils/appStore';
import Panel from './components/Panel';
import MessageButton from './components/MessageButton';
import FpsScreen from './components/FpsScreen';
import { useEffect } from 'react';
import getNodes from './utils/getNodes';
import { Flex, Progress } from 'antd';

const App: React.FC = observer(() => {
	const { loading, nodes, edges, updateNodes, updateEdges, updateConnections } =
		appStore;

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
				minZoom={0.01}
				fitView
				snapToGrid
				snapGrid={[30, 30]}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={updateNodes}
				onEdgesChange={updateEdges}
				onConnect={updateConnections}
				nodes={nodes}
				edges={edges}
				selectionMode={SelectionMode.Partial}
			>
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
