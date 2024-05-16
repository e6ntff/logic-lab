import { Flex, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useFps } from 'react-fps';
import appStore from '../utils/appStore';
import { useCallback, useMemo } from 'react';
import { ReloadOutlined } from '@ant-design/icons';

const FpsScreen: React.FC = observer(() => {
	const { viewport, setViewport } = appStore;
	const { currentFps } = useFps(window.innerWidth);

	const { x, y, zoom } = viewport;

	const isViewportChanged = useMemo(
		() => x !== 0 || y !== 0 || zoom !== 1,
		[x, y, zoom]
	);

	const resetViewport = useCallback(
		() => setViewport({ x: 0, y: 0, zoom: 1 }),
		[setViewport]
	);

	return (
		<Flex
			style={{ position: 'absolute', top: 20, right: 220 }}
			vertical
			align='end'
		>
			<Typography.Text
				type={currentFps >= 60 ? 'success' : 'danger'}
				style={{ fontSize: 25 }}
			>
				{currentFps || 0}
			</Typography.Text>
			<Flex
				vertical
				align='end'
			>
				<Typography.Text>x: {Math.round(-x / zoom)}</Typography.Text>
				<Typography.Text>y: {Math.round(y / zoom)}</Typography.Text>
				<Typography.Text>x{zoom.toFixed(2)}</Typography.Text>
			</Flex>
			{isViewportChanged && <ReloadOutlined onClick={resetViewport} />}
		</Flex>
	);
});

export default FpsScreen;
