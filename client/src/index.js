import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import {createRoot} from 'react-dom/client';
import Main from './Main';
import './index.css';

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render((
  <BrowserRouter>
    <Main /> {/* The various pages will be displayed by the `Main` component. */}
  </BrowserRouter>
  )
);
