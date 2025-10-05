import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Careers from './pages/Careers';
import Contacts from './pages/Contacts';
import Blogs from './pages/Blogs';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import RouteScrollTop from './route-scroll-top';

export default function App() {
  return (
    <>
      <RouteScrollTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <Layout>
                <Careers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Layout>
                <Contacts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Layout>
                <Blogs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/careers" replace />} />
        <Route path="*" element={<Navigate to="/careers" replace />} />
      </Routes>
    </>
  );
}

