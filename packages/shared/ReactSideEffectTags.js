// FiberNode 的副作用标志
export const NoEffect = /*          */ 0b000000000000;
export const PerformedWork = /*     */ 0b000000000001;
export const Placement = /*         */ 0b000000000010;
export const Update = /*            */ 0b000000000100;
export const PlaceAndUpdate = /*    */ 0b000000000110;
export const Deletion = /*          */ 0b000000001000;
export const ContentReset = /*      */ 0b000000010000;
export const Callback = /*          */ 0b000000100000;
export const DidCapture = /*        */ 0b000001000000;
export const Ref = /*               */ 0b000010000000;
export const Snapshot = /*          */ 0b000100000000;

// Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /**/0b000110100100;

// Union of all host effects
export const HostEffectMask = /*    */ 0b000111111111;

export const Incomplete = /*        */ 0b001000000000;
export const ShouldCapture = /*     */ 0b010000000000;