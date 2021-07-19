import React, { FC, useState } from 'react';
import BiBi from '@src/pages/Demo/Suspense/BiBi';
import CiCi from '@src/pages/Demo/Suspense/CiCi';
import Test from '@src/pages/Demo/Suspense/Test';

interface Props {

}

const SuspenseTest: FC<Props> = (_props) => {
  const [t, updateT] = useState(Date.now());
  return (
    <React.Suspense fallback={<span>loading....</span>}>
      <BiBi />
      <CiCi>
        <Test />
      </CiCi>
    </React.Suspense>
  );
};

export default SuspenseTest;
