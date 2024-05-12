import { Button, Flex, Tooltip } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import {
	ApiOutlined,
	BulbOutlined,
	CloudOutlined,
	EllipsisOutlined,
	HistoryOutlined,
	PlayCircleOutlined,
	PoweroffOutlined,
	ShareAltOutlined,
	WifiOutlined,
} from '@ant-design/icons';

const Panel: React.FC = observer(() => {
	const { addNode } = appStore;

	return (
		<Flex
			vertical
			gap={8}
			style={{
				position: 'absolute',
				inset: 0,
				zIndex: '999',
				inlineSize: 'min-content',
				blockSize: 'min-content',
			}}
		>
			<Button onClick={() => addNode(null, 'start', { output: true })}>
				<PoweroffOutlined />
			</Button>
			<Button
				onClick={() => addNode(null, 'button', { output: false, delay: 1000 })}
			>
				<PlayCircleOutlined />
			</Button>
			<Button onClick={() => addNode(null, 'and')}>&</Button>
			<Button onClick={() => addNode(null, 'or')}>||</Button>
			<Button onClick={() => addNode(null, 'xor')}>⊕</Button>
			<Button onClick={() => addNode(null, 'not')}>!</Button>
			<Button onClick={() => addNode(null, 'splitter')}>
				<ShareAltOutlined />
			</Button>
			<Button
				onClick={() =>
					addNode(null, 'flasher', {
						output: true,
						plusDelay: 1000,
						minusDelay: 1000,
					})
				}
			>
				<HistoryOutlined />
			</Button>
			<Button
				onClick={() => addNode(null, 'delay', { output: false, delay: 1000 })}
			>
				<EllipsisOutlined />
			</Button>
			<TransmitterPanel
				addTransmitter={() =>
					addNode(null, 'transmitter', {
						remote: { type: 'in', id: null },
					})
				}
				addReceiver={() => addNode(null, 'receiver', { remote: { id: null } })}
			/>
			<Button onClick={() => addNode(null, 'end')}>
				<BulbOutlined />
			</Button>
		</Flex>
	);
});

export default Panel;

interface PanelProps {
	addTransmitter: () => void;

	addReceiver: () => void;
}

const TransmitterPanel: React.FC<PanelProps> = observer(
	({ addTransmitter, addReceiver }) => {
		return (
			<Tooltip
				placement='right'
				trigger='click'
				overlayInnerStyle={{ background: '#0000', boxShadow: 'none' }}
				arrow={false}
				title={
					<Flex
						vertical
						align='start'
						gap={8}
					>
						<Flex gap={8}>
							<Button onClick={addTransmitter}>
								<WifiOutlined />
							</Button>
						</Flex>
						<Button onClick={addReceiver}>
							<ApiOutlined />
						</Button>
					</Flex>
				}
			>
				<Button>
					<CloudOutlined />
				</Button>
			</Tooltip>
		);
	}
);
