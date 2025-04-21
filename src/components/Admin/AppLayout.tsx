import React, { ReactNode, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './common/Header';
import Sidebar from './Sidebar';
import Footer from './common/Footer';
import { useSidebarContext } from './Context';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Admin/AppLayout.css';
import { UserContext } from '../../contexts/UserContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isOpen } = useSidebarContext();
  const { token } = useContext(UserContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken?.role;

        if (role !== 'ADMIN') {
          navigate('/my-account');
        }
      } catch (error) {
        console.error('Failed to decode token', error);
        navigate('/my-account');
      }
    } else {
      navigate('/my-account');
    }
  }, [token, history]);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className={`content-wrapper ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header />
        <main className="main-content p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;