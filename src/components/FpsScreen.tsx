import { Flex, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useFps } from 'react-fps';
import appStore from '../utils/appStore';

const FpsScreen: React.FC = observer(() => {
	const { viewport } = appStore;
	const { currentFps } = useFps(window.innerWidth);

	const { x, y, zoom } = viewport;

	return (
		<Flex
			style={{ position: 'absolute', bottom: 10, right: 10 }}
			vertical
			align='end'
		>
			<Typography.Text>x: {Math.round(-x / zoom)}</Typography.Text>
			<Typography.Text>y: {Math.round(y / zoom)}</Typography.Text>
			<Typography.Text
				type={currentFps >= 60 ? 'success' : 'danger'}
				style={{ fontSize: 25 }}
			>
				{currentFps || 0}
			</Typography.Text>
		</Flex>
	);
});

export default FpsScreen;
