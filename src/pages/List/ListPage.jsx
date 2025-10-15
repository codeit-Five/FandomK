import Header from '@/components/Header/Header';
import CreditSection from '@/pages/List/CreditSection/CreditSection';
import DonateSection from '@/pages/List/DonateSection/DonateSection';
import ChartSection from '@/pages/List/ChartSection/ChartSection';

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
