import { Button, Flex, Tooltip } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import {
	ApiOutlined,
	BulbOutlined,
	CloudOutlined,
	DisconnectOutlined,
	EllipsisOutlined,
	HistoryOutlined,
	LoginOutlined,
	LogoutOutlined,
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
			<Button onClick={() => addNode(null, 'start', { active: true })}>
				<PoweroffOutlined />
			</Button>
			<Button
				onClick={() => addNode(null, 'button', { active: false, delay: 1000 })}
			>
				<PlayCircleOutlined />
			</Button>
			<Button onClick={() => addNode(null, 'switch', { active: true })}>
				<DisconnectOutlined />
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
						active: true,
						plusDelay: 1000,
						minusDelay: 1000,
					})
				}
			>
				<HistoryOutlined />
			</Button>
			<Button
				onClick={() => addNode(null, 'delay', { active: false, delay: 1000 })}
			>
				<EllipsisOutlined />
			</Button>
			<TransmitterPanel
				addIn={() =>
					addNode(null, 'transmitterIn', { remote: { type: 'in', id: null } })
				}
				addOut={() =>
					addNode(null, 'transmitterOut', { remote: { type: 'out', id: null } })
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
	addIn: () => void;
	addOut: () => void;
	addReceiver: () => void;
}

const TransmitterPanel: React.FC<PanelProps> = observer(
	({ addIn, addOut, addReceiver }) => {
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
							<Button onClick={addIn}>
								<LoginOutlined />
							</Button>
							<Button onClick={addOut}>
								<LogoutOutlined />
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
