import { Drawer, Flex, Image } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import { ArrowRightOutlined } from '@ant-design/icons';
import logo from '../media/logo.png';
import { nodeType, nodeTypes } from '../utils/types';
import ReactFlow, { Node } from 'reactflow';
import { useCallback, useState } from 'react';

const Panel: React.FC = observer(() => {
	const { addNewNode } = appStore;

	const [open, setOpen] = useState<boolean>(true);

	const toggleOpen = useCallback(
		() => setOpen((prev: boolean) => !prev),
		[setOpen]
	);

	return (
		<>
			<Drawer
				styles={{
					content: { padding: 0 },
					header: { padding: 0 },
					body: { padding: 2.5 },
				}}
				open={open}
				autoFocus={false}
				mask={false}
				placement='left'
				width={40}
				closeIcon={<></>}
			>
				<Flex
					vertical
					gap={8}
					style={{
						inlineSize: '100%',
						blockSize: '100%',
					}}
					justify='start'
				>
					<ReactFlow
						fitView
						minZoom={0.25}
						maxZoom={0.25}
						zoomOnDoubleClick={false}
						nodes={panelNodes}
						zoomOnScroll={false}
						zoomOnPinch={false}
						translateExtent={[
							[0, 140],
							[0, 160 * 11],
						]}
						nodesDraggable={false}
						nodesConnectable={false}
						elementsSelectable={false}
						nodeTypes={nodeTypes}
						autoPanOnConnect={false}
						onNodeClick={(_, { type }) => addNewNode(type as nodeType)}
					/>
				</Flex>
			</Drawer>
			<Flex
				style={{
					pointerEvents: 'none',
					position: 'absolute',
					bottom: 10,
					left: 10,
					zIndex: 999,
					inlineSize: '7.5em',
				}}
			>
				<Image
					preview={false}
					src={logo}
					alt='logo'
				/>
			</Flex>
			<ArrowRightOutlined
				style={{
					position: 'absolute',
					top: 5,
					left: 5,
					zIndex: 9999,
					opacity: 0.5,
					rotate: `${open ? 180 : 0}deg`,
					transition: '.25s',
				}}
				onClick={toggleOpen}
			/>
		</>
	);
});

export default Panel;

const panelNodes: Node[] = [
	{ id: 'start', type: 'start', position: { x: 0, y: 160 * 0 }, data: {} },
	{ id: 'and', type: 'and', position: { x: 0, y: 160 * 1 }, data: {} },
	{ id: 'or', type: 'or', position: { x: 0, y: 160 * 2 }, data: {} },
	{ id: 'xor', type: 'xor', position: { x: 0, y: 160 * 3 }, data: {} },
	{ id: 'not', type: 'not', position: { x: 0, y: 160 * 4 }, data: {} },
	{
		id: 'splitter',
		type: 'splitter',
		position: { x: 0, y: 160 * 5 },
		data: {},
	},
	{ id: 'flasher', type: 'flasher', position: { x: 0, y: 160 * 6 }, data: {} },
	{ id: 'delay', type: 'delay', position: { x: 0, y: 160 * 7 }, data: {} },
	{ id: 'button', type: 'button', position: { x: 0, y: 160 * 8 }, data: {} },
	{
		id: 'transmitter',
		type: 'transmitter',
		position: { x: 0, y: 160 * 9 },
		data: {},
	},
	{
		id: 'receiver',
		type: 'receiver',
		position: { x: 0, y: 160 * 10 },
		data: {},
	},
	{ id: 'end', type: 'end', position: { x: 0, y: 160 * 11 }, data: {} },
];
