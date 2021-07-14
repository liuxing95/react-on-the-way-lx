// 涉及DOM的相关配置

const CHILDREN = 'children';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

function setTextContent(node, text) {
  let firstChild = node.firstChild;
  if (
    firstChild &&
    firstChild === node.lastChild &&
    firstChild.nodeType === TEXT_NODE
  ) {
    firstChild.nodeValue = text
  } else {
    node.textContent = text;
  }
}

export function shouldSetTextContent(type, props) {
  const children = props.children;
  return (
    type === 'noscript' ||
    type === 'textarea' ||
    type === 'option' ||
    typeof children === 'string' ||
    typeof children === 'number'
  )
}

export function createInstance(type, props) {
  const domElement = createElement(type, props);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function createTextInstance(text) {
  return document.createTextNode(text);
}
