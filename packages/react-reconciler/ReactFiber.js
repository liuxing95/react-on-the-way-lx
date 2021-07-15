import { NoEffect } from 'shared/ReactSideEffectTags';
import { NoWork } from './ReactFiberExpirationTime';
import {
  IndeterminateComponent,
  HostText,
  HostComponent,
  ClassComponent
} from 'shared/ReactWorkTags'

// 判断是否是 ClassComponent
function shouldConstruct(Component) {
  const prototype = Component.prototype
  return !!(prototype && prototype.isReactComponent);
}

export class  FiberNode {
  constructor(tag, pendingProps, key, mode) {
    // 1 ClassComponent
    // 3 HostRoot
    // 5 HostComponent
    this.tag = tag;
    this.pendingProps = pendingProps;
    // prop key
    this.key = key
    // 未使用
    this.mode = mode

    // type 字段由React.createElement 注入
    // 对于 FunctionComponent 指向 fn
    // 对于 ClassComponent 指向class
    // 对于 HostComponent 为对应DOM节点的字符串

    // 指向父 Fiber
    this.return = null;

    // 指向子Fiber
    this.child = null;

    // 指向兄弟Fiber
    this.sibling = null;

    this.ref = null;

    // 对于FunctionComponent 指向fn()
    // 对于ClassComponent 指向实例
    // 对于HostComponent 为对应DOM节点
    this.stateNode = null;
    this.effectTag = NoEffect;
    // fiber 的过期时间
    this.expirationTime = null;
    // 指向前一次 render的fiber
    this.alternate = null;

    // 以下3个变量组成了当前Fiber上保存的 effect list
    this.firstEffect = null;
    this.lastEffect = null;
  }
}

// 为 current fiber 创建 对应的 alternate fiber
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  // 如果没有workInProgress 说明是 新创建的fiber
  if (!workInProgress) {
    workInProgress = new FiberNode(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.stateNode = current.stateNode;
    workInProgress.type = current.type;
    workInProgress.alternate = current.alternate
  } else {
    workInProgress.pendingProps = pendingProps;

    // 已有alternate 的情况重置 effect
    workInProgress.effectTag = NoWork;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
  }

  workInProgress.expirationTime = current.expirationTime
  workInProgress.updateQueue = current.updateQueue
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;

  return workInProgress;
}

// type定义见 FiberNode class
export function createFiberFromTypeAndProps(type, key, pendingProps) {
  let fiberTag = IndeterminateComponent;

  // FunctionComponent ClassComponent 类型都是 function
  if (typeof type === 'function') {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent
    }
  } else if (typeof type === 'string') {
    fiberTag = HostComponent;
  }
  const fiber = new FiberNode(fiberTag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromElement(element) {
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps
  );
  return fiber;
}


export function createFiberFromText(textContent) {
  const fiber = new FiberNode(HostText, textContent);
  return fiber;
}