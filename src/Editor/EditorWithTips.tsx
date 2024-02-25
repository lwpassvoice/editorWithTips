import React, { useState, useEffect, useRef } from 'react';
import './Editor.scss';

interface EditorWithTipsProps {
  children: React.ReactNode;
}

const modifyChildren = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === 'textarea') {
        return React.cloneElement(child as React.ReactElement, { className: 'mo-textarea' });
      } else if (child.props.contentEditable) {
        return React.cloneElement(child as React.ReactElement, { className: 'mo-textarea mo-editable' });
      } else {
        return child;
      }
    }
    return child;
  })
}

const EditorWithTips: React.FC<EditorWithTipsProps> = (props) => {
  return (
    <div className='editor'>
      {
        props.children && modifyChildren(props.children)
      }
    </div>
  );
};

export default EditorWithTips;