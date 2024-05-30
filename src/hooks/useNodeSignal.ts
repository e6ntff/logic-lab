import { useEffect, useState } from 'react';
import appStore from '../utils/appStore';
import { NodeData } from '../utils/interfaces';
import { nodeType } from '../utils/types';
import isEqual from 'lodash/isEqual';

const getInput: (signals: boolean[], type: nodeType) => boolean = (
	signals,
	type
) => {
	if (!signals.length) signals = [false];
	switch (type) {
		case 'and':
			return signals.every((signal: boolean) => signal);
		case 'or':
			return signals.some((signal: boolean) => signal);
		case 'xor':
			return signals.length === 2 && signals[0] !== signals[1];
		default:
			return signals[0];
	}
};

const getOutput: (
	input: boolean,
	data: NodeData,
	type: nodeType
) => Promise<boolean> = (
	input,
	{ delay, plusDelay, minusDelay, prevNodeIds },
	type
) => {
	return new Promise<boolean>((resolve) => {
		switch (type) {
			case 'delay':
				setTimeout(() => resolve(input), delay);
				return;
			case 'not':
				resolve(!!prevNodeIds.length && !input);
				return;
			case 'flasher':
				setTimeout(() => resolve(input), input ? plusDelay : minusDelay);
				return;
			default:
				resolve(input);
				return;
		}
	});
};

const useNodeSignal = (id: string, data: NodeData, type: string) => {
	const { setSignal, signals } = appStore;

	const { prevNodeIds } = data;

	const [prevSignals, setPrevSignals] = useState<boolean[]>([]);

	useEffect(() => {
		const newSignals = Object.entries(signals).reduce(
			(result: boolean[], [key, value]: [string, boolean]) =>
				prevNodeIds.includes(key) ? [...result, value] : result,
			[]
		);
		setPrevSignals((prev: boolean[]) =>
			isEqual(newSignals, prev) ? prev : newSignals
		);
	}, [signals, prevNodeIds]);

	const [input, setInput] = useState<boolean>(false);
	const [output, setOutput] = useState<boolean>(false);

	useEffect(() => {
		setInput(getInput(prevSignals, type as nodeType));
	}, [type, prevSignals]);

	useEffect(() => {
		getOutput(input, data, type as nodeType).then(setOutput);
	}, [input, data, type, prevNodeIds]);

	useEffect(() => {
		setSignal(id, output);
	}, [output, id, setSignal]);

	return { output, setOutput, input, setInput };
};

export default useNodeSignal;
