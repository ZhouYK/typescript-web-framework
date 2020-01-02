import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import Lottie from 'react-lottie';
import classnames from 'classnames';

import animationData from './spinner_colorful.json';
import * as styles from './index.less';

const lottieOptions = {
  animationData,
  loop: true,
  autoplay: true,
};

interface LoadingSpinnerProps {
  show: boolean;
  parentElement?: HTMLElement | null;
  onLoadEnd?: () => void;
  className?: string;
  size?: number;
}

function LoadingSpinner({ show, parentElement, onLoadEnd, className, size = 48 }: LoadingSpinnerProps) {
  const [classNames, classNamesUpdater] = useState(() =>
    classnames(className, styles.loadingSpinner, {
      'loadingSpinner-hide': !show,
    }),
  );

  const [unMount, unMountUpdater] = useState(false);

  useEffect(() => {
    if (show) {
      unMountUpdater(false);
    }
    classNamesUpdater(
      classnames(className, styles.loadingSpinner, {
        'loadingSpinner-hide': !show,
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

export { LoadingSpinner };
export default LoadingSpinner;
