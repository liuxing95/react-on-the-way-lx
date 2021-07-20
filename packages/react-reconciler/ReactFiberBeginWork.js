// beginWork 为render 阶段的主要工作之一 主要做了如下事
// 根据 update更新state
// 根据 update更新 props
// 根据 update更新 effectTag
import {
  FunctionComponent,
  ClassComponent,
  HostRoot,
  HostComponent,
  HostText
} from 'shared/ReactWorkTags'
