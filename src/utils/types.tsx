import { EdgeTypes, NodeTypes } from 'reactflow';
import And from '../components/blocks/And';
import Wire from '../components/Wire';
import Or from '../components/blocks/Or';
import Not from '../components/blocks/Not';
import Start from '../components/blocks/Start';
import End from '../components/blocks/End';
import Splitter from '../components/blocks/Splitter';
import Flasher from '../components/blocks/Flasher';
import Delay from '../components/blocks/Delay';
import ButtonAntd from '../components/blocks/Button';
import Transmitter from '../components/blocks/Transmitter';
import Receiver from '../components/blocks/Receiver';
import Xor from '../components/blocks/Xor';
import {
	ApiOutlined,
	BulbOutlined,
	EllipsisOutlined,
	HistoryOutlined,
	LineOutlined,
	PlayCircleOutlined,
	PoweroffOutlined,
	ShareAltOutlined,
	WifiOutlined,
} from '@ant-design/icons';

export type nodeType =
	| 'and'
	| 'or'
	| 'xor'
	| 'not'
	| 'splitter'
	| 'delay'
	| 'flasher'
	| 'button'
	| 'start'
	| 'transmitter'
	| 'receiver'
	| 'end';

export type edgeType = 'wire';

export const nodeTypes: NodeTypes = {
	and: And,
	or: Or,
	xor: Xor,
	not: Not,
	start: Start,
	end: End,
	splitter: Splitter,
	flasher: Flasher,
	delay: Delay,
	button: ButtonAntd,
	transmitter: Transmitter,
	receiver: Receiver,
};

export const edgeTypes: EdgeTypes = { wire: Wire };

export const icons: { [key: string]: any } = {
	and: '&',
	or: '||',
	xor: '⊕',
	not: '!',
	start: <PoweroffOutlined />,
	end: <BulbOutlined />,
	splitter: <ShareAltOutlined />,
	flasher: <HistoryOutlined />,
	delay: <EllipsisOutlined />,
	button: <PlayCircleOutlined />,
	transmitter: <WifiOutlined />,
	receiver: <ApiOutlined />,
	edge: <LineOutlined />,
};
