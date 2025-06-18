import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './i18n';
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AOS from 'aos';
import { EnrolledLearnersPage } from './pages/InstructorCourse';
import { Route } from 'react-router-dom';

function Main() {
  useEffect(() => {
    AOS.init({ once: true, duration: 900, offset: 60 });
  }, []);
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
