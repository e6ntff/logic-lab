import { EdgeTypes, NodeTypes } from 'reactflow';
import And from '../components/And';
import Wire from '../components/Wire';
import Or from '../components/Or';
import Not from '../components/Not';

export type nodeType = 'and' | 'or' | 'not';

export type edgeType = 'wire';

export const nodeTypes: NodeTypes = { and: And, or: Or, not: Not };

export const edgeTypes: EdgeTypes = { wire: Wire };
