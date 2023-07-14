import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './app/store.js'
import { Provider} from 'react-redux' 
import { BrowserRouter as Router, Route , Routes, BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App/>}></Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
)

