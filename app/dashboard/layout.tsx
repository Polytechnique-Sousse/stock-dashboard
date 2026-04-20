import Sidebar from "../components/Sidebar";
import { ToastContainer } from 'react-toastify';

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="ml-64 flex-1  bg-gray-100 p-6">
        {children}
        <ToastContainer />

      </main>

    </div>
  );
}