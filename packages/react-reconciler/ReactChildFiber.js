// 协调子fiber的过程
import {
  createFiberFromElement,
  createFiberFromText
} from './ReactFiber'
import {Placement} from 'shared/ReactSideEffectTags';
import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';