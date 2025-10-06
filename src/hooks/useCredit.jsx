import { create } from 'zustand';

const useCredit = create(set => ({
  credit: 0,
  increaseCredit: donation =>
    set(state => ({ credit: state.credit + donation })),
  decreaseCredit: () => set(state => ({ credit: state.credit - 1000 })),
}));

export default useCredit;
