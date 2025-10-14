import { ToastContainer } from 'react-toastify';
import Header from '../../components/Header/Header';
import CreditSection from './CreditSection/CreditSection';
import DonateSection from './DonateSection/DonateSection';
import ChartSection from './ChartSection/ChartSection';

function ListPage() {
  return (
    <div>
      <Header />
      <CreditSection />
      <DonateSection />
      <ChartSection />

      <ToastContainer autoClose={2000} theme="dark" />
    </div>
  );
}

export default ListPage;
