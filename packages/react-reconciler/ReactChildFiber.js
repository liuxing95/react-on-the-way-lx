// 协调子fiber的过程
import {
  createFiberFromElement,
  createFiberFromText
} from './ReactFiber'
import {Placement} from 'shared/ReactSideEffectTags';
import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';

// 为了在2个方法中复用一批共用方法
// shouldTrackSideEffects 标示是否标记fiber 的 effectTag
// 对于首次渲染 不需要标记effectTag 因为 completeWork时会appendAllChildren，最后一次渲染整棵树
// 对于单次更新 需要标记更新 fiber 的effectTag
function ChildReconciler(shouldTrackSideEffects) {

  function createChild(returnFiber, newChild) {
    // 创建文本节点fiber 添加到 returnFiber 下面
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      const created = createFiberFromText(newChild)
      created.return = returnFiber;
      return created
    }
    // 如果是object类型数据 判断是否为 react节点 创建fiber
    if (typeof newChild === 'object' && newChild !== null) {
      if (newChild.$$typeof === REACT_ELEMENT_TYPE) {
        const created = createFiberFromElement(newChild);
        created.return = returnFiber;
        return created;
      }
    }
    return null;
  }

  // 协调子fiber 创建fiber
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    // key diff 算法待补充
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent) {
    // 省略更新过程
    const created = createFiberFromText(textContent);
    created.return = returnFiber;
    return created;
  }

  // 标记当前fiber需要在commit阶段插入DOM
  function placeSingleChild(fiber) {
    // alternate 存在表示该fiber 已经插入到DOM
    if (shouldTrackSideEffects && !fiber.alternate) {
      fiber.effectTag = Placement
    }
    return fiber
  }

  function reconcileChildArray(returnFiber, currentFirstChild, newChild) {
    // TODO array diff
    let prev;
    let first;
    for(let i = 0; i < newChild.length; i++) {
      const child = newChild[i];
      const newFiber = createChild(returnFiber, child)
      if (!newFiber) {
        continue;
      }
      placeSingleChild(newFiber)
      if (prev) {
        prev.sibling = newFiber
      }
      if (!first) {
        first = newFiber
      }
      prev = newFiber
    }
    return first
  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    // React.createElement 类型 或者 子节点是 String Nunber 对应的Array类型
    const isObject = typeof newChild === 'object' && newChild !== null;
    if (isObject) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild
          ))
      }
      // 在 beginWork update各类Component时并未处理HostText，这里处理单个HostText
      if (typeof newChild === 'number' || typeof newChild === 'string') {
        return placeSingleChild(reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          newChild
        ))
      }
    }
    console.log('未实现的协调分支逻辑');
  }
  return reconcileChildFibers
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
