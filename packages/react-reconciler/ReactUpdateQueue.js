export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export function createUpdate(expirationTime) {
  return {
    expirationTime,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  }
}

export function initializeUpdateQueue(fiber) {
  fiber.updateQueue = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null
    },
    effects: null
  }
}

// 为 workInProgress 复制一份 updateQueue
export function cloneUpdateQueue(current, workInProgress) {
  const currentQueue = current.updateQueue;
  const workInProgressQueue = workInProgress.updateQueue;
  if (currentQueue === workInProgressQueue) {
    workInProgressQueue.updateQueue = {
      baseState: currentQueue.baseState,
      baseQueue: currentQueue.baseQueue,
      shared: currentQueue.shared,
      effects: currentQueue.effects
    }
  }
}

// 将update插入单向环状链表
// 插入 u0 形成 u0 - u0 当前pending： u0
// 插入 u1 形成 u1 - u0 - u1 当前 pening u1
// 插入 u2 形成 u2 - u0 - u1 -u2 当前 pening u2
// 插入 u3 形成 u3 - u0 - u1 - u2 -u3  当前pending: u3
// 所以 shared.pending 为 lastPendingUpdate
// shared.pending.next 为 firstPendingUpdate
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue
  if (!updateQueue) {
    // fiber已经unmount
    return;
  }

  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending
  // 使新插入的update始终处于单向环状链表首位
  if (!pending) {
    // 这是第一个update 使它形成单向环状链表
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  sharedQueue.pending = update
}

export function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps) {
  switch (update.tag) {
    case UpdateState:
      const payload = update.payload
      if (payload) return prevState
      return Object.assign({}, prevState, payload);
    default:
      break;
  }
}

// 通过遍历 update 链表 根据 fiber.tag 不同 通过不同的路径计算新的state
export function processUpdateQueue(workInProgress, nextProps) {
  const queue = workInProgress.updateQueue
  // base queue 为单向非环链表
  let firstBaseUpdate = queue.firstBaseUpdate
  let lastBaseUpdate = queue.lastBaseUpdate;

  // 如果有 pendingUpdate 需要将 pendingUpdate 的单向环状链表剪开并拼在baseUpdate单向链表后面
  let pendingQueue = queue.shared.pending;
  if (pendingQueue) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue
    const firstPendingUpdate = pendingQueue.next;
    // 将环剪开
    lastPendingUpdate.next = null;

    // 将pendingUpdate拼入baseUpdate
    if (!lastBaseUpdate) {
      firstBaseUpdate = firstPendingUpdate
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;

    const current = workInProgress.alternate;
    // 存在 current 更新其 updateQueue
    if (current) {
      const currentQueue = current.updateQueue;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate
      if (lastBaseUpdate !== currentLastBaseUpdate) {
        // if ()
      }
    }
  }
}