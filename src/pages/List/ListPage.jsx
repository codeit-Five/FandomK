import Header from '../../components/Header/Header';
import CreditSection from './CreditSection/CreditSection';
import DonateSection from './DonateSection/DonateSection';
import Chart from './Chart/Chart';

function ListPage() {
  return (
    <div>
      <Header />
      <CreditSection />
      <DonateSection />
      <Chart />
    </div>
  );
}

export default ListPage;
