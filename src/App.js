// Project structure follows best practices: src/ for components, public/ for static assets, etc.
import React from 'react';
import TodoList from './TodoList';

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
