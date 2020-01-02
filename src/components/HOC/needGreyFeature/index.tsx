import React, { useEffect, useState, ReactType } from 'react';
import { getFeatureList } from '../../../api/referral';

const needGreyFeature = (WrapperComponent: ReactType) => (props: any) => {
  const [greyList, setGreyList] = useState([]);

  useEffect(() => {
    getFeatureList()
      .then((list: string[]) => setGreyList(list))
      .catch((err: Error) => {
        console.error(err);
        setGreyList([]);
      });
  }, []);

  return <WrapperComponent greyList={greyList} {...props} />;
};

export default needGreyFeature;
