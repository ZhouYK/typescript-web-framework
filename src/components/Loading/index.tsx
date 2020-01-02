import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import Lottie from 'react-lottie';
import classnames from 'classnames';

import animationData from './loadingAnimation.json';
import * as styles from './index.less';

const lottieOptions = {
  animationData,
  loop: true,
  autoplay: true,
};

interface LoadingProps {
  show: boolean;
  parentElement?: HTMLElement | null;
  onLoadEnd?: () => void;
  className?: string;
  size?: number;
}

function Loading({ show, parentElement, onLoadEnd, className, size = 48 }: LoadingProps) {
  const [classNames, classNamesUpdater] = useState(() =>
    classnames(className, styles.loading, {
      'loading-hide': !show,
    }),
  );

  const [unMount, unMountUpdater] = useState(false);

  useEffect(() => {
    if (show) {
      unMountUpdater(false);
    }
    classNamesUpdater(
      classnames(className, styles.loading, {
        'loading-hide': !show,
      }),
    );
  }, [show]);

  const handleTransitionEnd = () => {
    if (!show) {
      unMountUpdater(true);
      if (onLoadEnd) {
        onLoadEnd();
      }
    }
  };

  let result = null;
  if (!unMount) {
    const loadingElement = (
      <div className={classNames}>
        <Lottie options={lottieOptions} width={size} height={size} isClickToPauseDisabled={true} />
      </div>
    );

    if (parentElement) {
      result = ReactDom.createPortal(loadingElement, parentElement);
    } else {
      result = loadingElement;
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTransitionEnd();
    }, 160);

    return () => {
      clearTimeout(timer);
    };
  }, [show]);

  return result;
}

export { Loading };
export default Loading;
