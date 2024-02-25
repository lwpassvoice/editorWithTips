import { useState } from 'react'
import './App.css'
import EditorWithTips from './Editor/EditorWithTips'

function App() {

  return (
    <div className='app-warpper'>
      <h3>Textarea:</h3>
      <EditorWithTips>
        <textarea></textarea>
      </EditorWithTips>
      <br />
      <h3>ContentEditable:</h3>
      <EditorWithTips>
        <div contentEditable></div>
      </EditorWithTips>
    </div>
  )
}

export default App;
