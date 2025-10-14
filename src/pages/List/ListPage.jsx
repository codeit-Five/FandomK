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
    </div>
  );
}

export default ListPage;
