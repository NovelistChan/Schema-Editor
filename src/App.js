import React from 'react';
import Editor from './components/editor'
import Def from './tryDef.json'
import date from './components/editor/components/Date/index'

const extensions = {
  date
}

function App() {
  return (
    <div className="App">
      <Editor data=
      // {JSON.stringify({
      //   type: "object",
      //   properties: {
          
      //   }
      // })}
        {JSON.stringify(Def)}
        extensions = {extensions}
      />
    </div>
  );
}

export default App;
