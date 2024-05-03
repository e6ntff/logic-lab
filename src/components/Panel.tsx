import { Button, Flex } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import {
	BulbOutlined,
	DisconnectOutlined,
	EllipsisOutlined,
	HistoryOutlined,
	PlayCircleOutlined,
	PoweroffOutlined,
	ShareAltOutlined,
} from '@ant-design/icons';

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
			<Button onClick={() => addNode('start', { active: true })}>
				<PoweroffOutlined />
			</Button>
			<Button onClick={() => addNode('button', { active: false, delay: 1000 })}>
				<PlayCircleOutlined />
			</Button>
			<Button onClick={() => addNode('switch', { active: true })}>
				<DisconnectOutlined />
			</Button>
			<Button onClick={() => addNode('and')}>&</Button>
			<Button onClick={() => addNode('or')}>||</Button>
			<Button onClick={() => addNode('xor')}>⊕</Button>
			<Button onClick={() => addNode('not')}>!</Button>
			<Button onClick={() => addNode('splitter')}>
				<ShareAltOutlined />
			</Button>
			<Button
				onClick={() =>
					addNode('flasher', {
						active: true,
						plusDelay: 1000,
						minusDelay: 1000,
					})
				}
			>
				<HistoryOutlined />
			</Button>
			<Button onClick={() => addNode('delay', { active: false, delay: 1000 })}>
				<EllipsisOutlined />
			</Button>
			<Button onClick={() => addNode('end')}>
				<BulbOutlined />
			</Button>
		</Flex>
	);
});

export default Panel;
