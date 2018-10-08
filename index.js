import '@babel/polyfill';
import combineNodes from './radon/combineNodes';
import ConstructorNode from './radon/constructorNode';

export const combineState = combineNodes;
export const StateNode = ConstructorNode;