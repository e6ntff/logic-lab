import { Button, Flex } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';

const Panel: React.FC = observer(() => {
	const { addNode } = appStore;

	return (
		<Flex
			style={{
				position: 'absolute',
				inset: 0,
				zIndex: '999',
				inlineSize: 'min-content',
				blockSize: 'min-content',
			}}
		>
			<Button onClick={() => addNode('and')}>AND</Button>
		</Flex>
	);
});

export default Panel;
