import { Button, Flex } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import {
	ApiOutlined,
	BulbOutlined,
	EllipsisOutlined,
	HistoryOutlined,
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
			<Button onClick={() => addNode('start')}>
				<ApiOutlined />
			</Button>
			<Button onClick={() => addNode('and')}>&</Button>
			<Button onClick={() => addNode('or')}>||</Button>
			<Button onClick={() => addNode('not')}>!</Button>
			<Button onClick={() => addNode('splitter')}>
				<ShareAltOutlined />
			</Button>
			<Button onClick={() => addNode('flasher')}>
				<HistoryOutlined />
			</Button>
			<Button onClick={() => addNode('delay')}>
				<EllipsisOutlined />
			</Button>
			<Button onClick={() => addNode('end')}>
				<BulbOutlined />
			</Button>
		</Flex>
	);
});

export default Panel;
