import { Button, Flex } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';

const Panel: React.FC = observer(() => {
	const { addNode } = appStore;

	return (
		<Flex
			vertical
			gap={16}
			style={{
				position: 'absolute',
				inset: 0,
				zIndex: '999',
				inlineSize: 'min-content',
				blockSize: 'min-content',
			}}
		>
			<Button onClick={() => addNode('start')}>START</Button>
			<Button onClick={() => addNode('and')}>AND</Button>
			<Button onClick={() => addNode('or')}>OR</Button>
			<Button onClick={() => addNode('not')}>NOT</Button>
			<Button onClick={() => addNode('end')}>END</Button>
		</Flex>
	);
});

export default Panel;
