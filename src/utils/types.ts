import { EdgeTypes, NodeTypes } from 'reactflow';
import And from '../components/And';
import Wire from '../components/Wire';
import Or from '../components/Or';
import Not from '../components/Not';
import Start from '../components/Start';
import End from '../components/End';
import Splitter from '../components/Splitter';
import Flasher from '../components/Flasher';
import Delay from '../components/Delay';
import Switch from '../components/Switch';

export type nodeType =
	| 'and'
	| 'or'
	| 'not'
	| 'splitter'
	| 'delay'
	| 'flasher'
	| 'switch'
	| 'start'
	| 'end';

export type edgeType = 'wire';

export const nodeTypes: NodeTypes = {
	and: And,
	or: Or,
	not: Not,
	start: Start,
	end: End,
	splitter: Splitter,
	flasher: Flasher,
	delay: Delay,
	switch: Switch,
};

export const edgeTypes: EdgeTypes = { wire: Wire };
