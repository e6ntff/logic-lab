import { Button, Flex, Image, Tooltip } from 'antd';
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

import logo from '../media/logo.png';

const Panel: React.FC = observer(() => {
	const { addNewNode } = appStore;

	return (
		<>
			<Flex
				vertical
				gap={8}
				style={{
					overflow: 'visible',
					position: 'absolute',
					left: 5,
					top: 5,
					zIndex: 999,
					inlineSize: 'min-content',
					blockSize: 'min-content',
				}}
			>
				<Button
					size='large'
					onClick={() => addNewNode('start', { output: true })}
				>
					<PoweroffOutlined />
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('button', { output: false, delay: 1000 })}
				>
					<PlayCircleOutlined />
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('and')}
				>
					&
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('or')}
				>
					||
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('xor')}
				>
					⊕
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('not')}
				>
					!
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('splitter')}
				>
					<ShareAltOutlined />
				</Button>
				<Button
					size='large'
					onClick={() =>
						addNewNode('flasher', {
							output: true,
							plusDelay: 1000,
							minusDelay: 1000,
						})
					}
				>
					<HistoryOutlined />
				</Button>
				<Button
					size='large'
					onClick={() => addNewNode('delay', { output: false, delay: 1000 })}
				>
					<EllipsisOutlined />
				</Button>
				<TransmitterPanel
					addTransmitter={() =>
						addNewNode('transmitter', {
							remote: { type: 'in', id: null },
						})
					}
					addReceiver={() => addNewNode('receiver', { remote: { id: null } })}
				/>
				<Button
					size='large'
					onClick={() => addNewNode('end')}
				>
					<BulbOutlined />
				</Button>
			</Flex>
			<Flex
				style={{
					pointerEvents: 'none',
					position: 'absolute',
					bottom: 10,
					left: 10,
					zIndex: 9999,
					inlineSize: '7.5em',
				}}
			>
				<Image
					preview={false}
					src={logo}
					alt='logo'
				/>
			</Flex>
		</>
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
					<Flex gap={12}>
						<Button
							size='large'
							onClick={addTransmitter}
						>
							<WifiOutlined />
						</Button>
						<Button
							size='large'
							onClick={addReceiver}
						>
							<ApiOutlined />
						</Button>
					</Flex>
				}
			>
				<Button size='large'>
					<CloudOutlined />
				</Button>
			</Tooltip>
		);
	}
);
