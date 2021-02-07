import { useLayoutEffect } from 'react';

type fnc = () => string;
const useDocumentTitle = (title: string | fnc): void => {
  useLayoutEffect(() => {
    let temp = 'MIS';
    if (typeof title === 'string') {
      temp = title;
    } else if (typeof title === 'function') {
      temp = title();
    }
    document.title = temp;
  }, [title]);
};

export default useDocumentTitle;
