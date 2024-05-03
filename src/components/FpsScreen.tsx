import Title from 'antd/es/typography/Title';
import { observer } from 'mobx-react-lite';
import { useFps } from 'react-fps';

const FpsScreen: React.FC = observer(() => {
	const { currentFps } = useFps(window.innerWidth);

	return (
		<Title
			type={currentFps >= 60 ? 'success' : 'danger'}
			style={{ position: 'absolute', bottom: -10, right: 20 }}
		>
			{currentFps}
		</Title>
	);
});

export default FpsScreen;
