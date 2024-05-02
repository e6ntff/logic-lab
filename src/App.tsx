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
import { ConfigProvider } from 'antd';

const App: React.FC = observer(() => {
	const { nodes, edges, updateNodes, updateEdges, updateConnections } =
		appStore;

	return (
		<ConfigProvider
			theme={{
				components: {
					Progress: {
						motionDurationSlow: '0s',
						motionEaseInOutCirc: 'linear',
						motionEaseOutQuint: 'linear',
					},
				},
			}}
		>
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
					inversePan
					pannable
					zoomable
					zoomStep={1.25}
				/>
			</ReactFlow>
		</ConfigProvider>
	);
});

export default App;
