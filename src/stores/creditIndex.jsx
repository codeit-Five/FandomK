import { create } from 'zustand';

const STORAGE_CREADIT = 'userCredit';
const useCredit = create(set => ({
  credit: (() => {
    const savedCredit = localStorage.getItem(STORAGE_CREADIT);
    return savedCredit ? JSON.parse(savedCredit) : 1000;
  })(),
  increaseCredit: changeCredit =>
    set(state => {
      const newCredit = state.credit + changeCredit;
      localStorage.setItem(STORAGE_CREADIT, JSON.stringify(newCredit));
      return { credit: newCredit };
    }),
  decreaseCredit: changeCredit =>
    set(state => {
      const newCredit = state.credit - changeCredit;
      localStorage.setItem(STORAGE_CREADIT, JSON.stringify(newCredit));
      return { credit: newCredit };
    }),
}));

export default useCredit;
