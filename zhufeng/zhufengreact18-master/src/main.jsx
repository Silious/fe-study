import React from 'react';
//import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
const root = document.getElementById('root');
import OldBatchUpdatePage from './routes/OldBatchUpdatePage'
import NewBatchUpdatePage from './routes/NewBatchUpdatePage'
import SuspensePage from './routes/SuspensePage'
import StartTransitionPage from './routes/StartTransitionPage'
import UpdatePriorityPage from './routes/UpdatePriorityPage'
import UseDeferredValuePage from './routes/UseDeferredValuePage'
import UseTransitionPage from './routes/UseTransitionPage'
import UseSyncExternalStorePage from './routes/UseSyncExternalStorePage'
import UseInsertionEffectPage from './routes/UseInsertionEffectPage'
import ErrorPage from './routes/ErrorPage'
const element = <ErrorPage />;
//render(element, root);
createRoot(root).render(element);