import { create } from 'zustand';

const useCredit = create(set => ({
  credit: 0,
  increaseCredit: myCredit =>
    set(state => ({ credit: state.credit + myCredit })),
  decreaseCredit: myCredit =>
    set(state => ({ credit: state.credit - myCredit })),
}));

export default useCredit;
