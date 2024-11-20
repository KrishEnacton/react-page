import { useState } from 'react';
import Editor from './editor/Editor';
import './index.css';

function App() {
  const [value, setValue] = useState<any>(null);

  return (
    <>
      <Editor cellPlugins={[]} value={value} onChange={setValue} />
    </>
  );
}

export default App;
