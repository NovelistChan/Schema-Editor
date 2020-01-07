import React from 'react';
import Editor from './components/editor'
import Def from './tryDef.json'
import date from './components/editor/components/Date/index'

const extensions = {
  date
}

class App extends React.Component {

  state = {
    schema: JSON.stringify(Def)
  }

  render() {
    return (
      <div className="App">
        <Editor data={this.state.schema}
          // {JSON.stringify({
          //   type: "object",
          //   properties: {

          //   }
          // })}
          
          extensions={extensions}
          onChange={schema => console.log(schema)}
        />
      </div>
    );
  }
}

export default App;
