import { observer } from 'mobx-react-lite';
import ReactFlow, { Background, ConnectionMode, Controls } from 'reactflow';
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
				snapToGrid
				snapGrid={[20, 20]}
				connectionMode={'loose' as ConnectionMode}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={updateNodes}
				onEdgesChange={updateEdges}
				onConnect={updateConnections}
				nodes={nodes}
				edges={edges}
			>
				<Background />
				<Controls />
			</ReactFlow>
		</ConfigProvider>
	);
});

export default App;
