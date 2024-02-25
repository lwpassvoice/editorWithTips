import React, { useState, useEffect, useRef } from 'react';
import './Editor.scss';
import Tips from './Tips';

interface EditorWithTipsProps {
  children: React.ReactNode;
}

interface CaretPosition {
  left: number;
  top: number;
}

// TODO: get tips form api
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
};

const EditorWithTips: React.FC<EditorWithTipsProps> = ({ children }) => {
  const [showTips, setShowTips] = useState(false);
  const [tipsContent, setTipsContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (showTips) {
          const textarea = editorRef.current?.querySelector('.mo-textarea');
          if (textarea) {
            (textarea as HTMLTextAreaElement).value += tipsContent;
            setShowTips(false);
          }
          const contentEditable = editorRef.current?.querySelector('.mo-editable') as HTMLDivElement;
          if (contentEditable) {
            contentEditable.textContent += tipsContent;
            setShowTips(false);
            // reset caret's position
            const range = document.createRange();
            const sel = window.getSelection()!;
            range.selectNodeContents(contentEditable);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            contentEditable.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTips, tipsContent]);

  const isCursorAtEnd = (element: HTMLTextAreaElement | null) => {
    if (!element) return false;
    return element.selectionStart === element.value.length;
  };

  const isCursorAtEndOfContentEditable = (element: HTMLElement): boolean => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return false;
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(element);
    clonedRange.setStart(range.endContainer, range.endOffset);
    return clonedRange.toString() === '';
  };

  // const getCaretCoordinates = (element: HTMLTextAreaElement) => {
  //   const position = element.selectionStart;
  //   const div = document.createElement('div');
  //   document.body.appendChild(div);
  //   const style = getComputedStyle(element);
  //   const props = ['font-size', 'font-family', 'width', 'text-align', 'letter-spacing', 'padding'];
  //   props.forEach(prop => {
  //     // @ts-ignore
  //     div.style[prop as keyof CSSStyleDeclaration] = style[prop as keyof CSSStyleDeclaration];
  //   });
  //   div.textContent = element.value.substr(0, position);
  //   const span = document.createElement('span');
  //   span.textContent = element.value.substr(position) || '.';
  //   div.appendChild(span);
  //   const coordinates = { left: span.offsetLeft, top: span.offsetTop };
  //   document.body.removeChild(div);
  //   return coordinates;
  // };

  // const getCaretCoordinatesForContentEditable1 = (element: HTMLDivElement): CaretPosition => {
  //   const selection = window.getSelection();
  //   if (!selection || selection.rangeCount === 0) return { left: 0, top: 0 };
  //   const range = selection.getRangeAt(0).cloneRange();
  //   const rect = range.getBoundingClientRect();
  //   return { left: rect.left, top: rect.top };
  // };

  const getCaretCoordinatesForContentEditable = (): CaretPosition => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return { left: 0, top: 0 };
  
    const range = selection.getRangeAt(0).cloneRange();
    const span = document.createElement('span');
    span.textContent = '\u200b';
    range.insertNode(span);
    const rect = span.getBoundingClientRect();
  
    span.parentNode!.removeChild(span);
  
    return { left: rect.left, top: rect.top };
  };

  const getCaretCoordinatesSimply = (element: HTMLTextAreaElement): CaretPosition => {
    const style = getComputedStyle(element);
    // @ts-ignore
    const paddingTop = parseInt(style['padding-top']);
    // @ts-ignore
    const paddingLeft = parseInt(style['padding-left']);
    // @ts-ignore
    const fontSize = parseInt(style['font-size']);
    // FIXME: left may not correct
    // @ts-ignore
    const left = paddingLeft + element.value.length * fontSize + 4;
    // @ts-ignore
    return { left, top: paddingTop };
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      const target = e.target as HTMLTextAreaElement | HTMLDivElement;
      const isAtEnd = target.classList.contains('mo-textarea') ? isCursorAtEnd(target as HTMLTextAreaElement) : isCursorAtEndOfContentEditable(target);
      if (isAtEnd) {
        const randomString = generateRandomString();
        setTipsContent(randomString);
        // FIXME: position not correct
        // const cursorPosition = target.classList.contains('mo-textarea') ? getCaretCoordinates(target as HTMLTextAreaElement) : getCaretCoordinatesForContentEditable(target as HTMLDivElement);
        const cursorPosition = target.classList.contains('mo-textarea') ? getCaretCoordinatesSimply(target as HTMLTextAreaElement) : getCaretCoordinatesForContentEditable();

        const tipsElement = editorRef.current!.querySelector('.tips-container');
        if (tipsElement) {
          tipsElement.setAttribute('style', `left: ${cursorPosition.left}px; top: ${cursorPosition.top}px;`);
        }
        console.log('cursor position:', cursorPosition, tipsElement);

        setShowTips(true);
      }
    }, 1000);
  };

  const genChildClassName = (child: React.ReactElement): string | void => {
    if (child.type === 'textarea') {
      return `${child.props.className || ''} mo-basic mo-textarea`;
    }
    if (child.props.contentEditable) {
      return `${child.props.className || ''} mo-basic mo-editable`;
    }
  }

  const modifiedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && (child.type === 'textarea' || child.props.contentEditable)) {
      return React.cloneElement(child as React.ReactElement, {
        className: genChildClassName(child),
        onInput: handleInput,
      });
    }
    return child;
  });

  return (
    <div className='editor' ref={editorRef}>
      {modifiedChildren}
      <Tips message={tipsContent} isShow={showTips} />
    </div>
  );
};

export default EditorWithTips;