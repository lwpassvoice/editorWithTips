import { useState } from 'react'
import './App.css'
import EditorWithTips from './Editor/EditorWithTips'

function App() {

  return (
    <>
      <div>editor-with-tips</div>
      <EditorWithTips>
        <textarea></textarea>
      </EditorWithTips>
      <EditorWithTips>
        <div contentEditable></div>
      </EditorWithTips>
    </>
  )
}

export default App
