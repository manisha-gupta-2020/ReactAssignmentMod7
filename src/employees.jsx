import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import Page from './Page.jsx'

const root = createRoot(document.getElementById('content'))
root.render(
    <Router>
        <React.StrictMode>
            <Page />
        </React.StrictMode>
    </Router>
)