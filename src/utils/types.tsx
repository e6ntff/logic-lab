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
import Xor from '../components/blocks/Xor';
import {
	ApiOutlined,
	BulbOutlined,
	LineOutlined,
	PlayCircleOutlined,
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
};

export const edgeTypes: EdgeTypes = { wire: Wire };

export const icons: { [key: string]: any } = {
	and: '&',
	or: '||',
	xor: '⊕',
	not: '!',
	end: <BulbOutlined />,
	splitter: <ShareAltOutlined />,
	button: <PlayCircleOutlined />,
	transmitter: <WifiOutlined />,
	receiver: <ApiOutlined />,
	edge: <LineOutlined />,
};
