import React, {
  forwardRef, PropsWithChildren, useEffect, useRef,
} from 'react';
import ReactPerfectScrollbar, {
  ScrollBarProps,
} from 'react-perfect-scrollbar';
import classNames from 'classnames';
import parser from 'ua-parser-js';
import { getSafe } from '@src/tools/util';

import style from './style.less';


export interface ScrollbarProps extends ScrollBarProps {
  /* 垂直方向滚动条是否常显 */
  isVerticalResident?: boolean;
  children?: React.ReactNode;
  /* windows垂直方向滚动条是否常显 */
  isWindowsHorizontalResident?: boolean;
  /* windows垂直方向滚动条是否常显 */
  isWindowsVerticalResident?: boolean;
}

let isWindows = false;
const os = new parser.UAParser().getOS().name;
if (os) {
  isWindows = os.toLocaleLowerCase().includes('windows');
}

// 简单事件分发
const event: {
  listenersMap: Record<string, Function[]>;
  on: (key: string, handle: Function) => void;
  emit: (key: string, data?: any) => void;
  removeListeners: Function;
  removeAlListeners: Function;
} = {
  listenersMap: {},
  on: (key: string, handle: Function) => {
    if (!(event.listenersMap[key] instanceof Array)) {
      event.listenersMap[key] = [];
    }

    event.listenersMap[key].push(handle);
  },
  emit: (key: string, data?: any) => {
    const listeners = event.listenersMap[key];

    if (!(listeners instanceof Array)) {
      return;
    }

    listeners.forEach((listener) => {
      if (typeof listener === 'function') {
        listener(data);
      }
    });
  },
  removeListeners: (key: string) => {
    if (event.listenersMap[key]) {
      delete event.listenersMap[key];
    }
  },
  removeAlListeners: () => {
    Object.keys(event.listenersMap).forEach((key) => {
      delete event.listenersMap[key];
    });
  },
};

const requestAnimationFrameModule = {
  key: 'requestAnimationFrameModule',
  runCounter: 0,
  addCounter: 0,
  isRun: false,
  frameMount: 60,
  add: (): void => {
    requestAnimationFrameModule.addCounter += 1;

    if (!requestAnimationFrameModule.isRun) {
      requestAnimationFrameModule.run();
    }

    requestAnimationFrameModule.isRun = true;
  },
  minus: (): void => {
    requestAnimationFrameModule.addCounter -= 1;

    if (requestAnimationFrameModule.addCounter <= 0) {
      requestAnimationFrameModule.stop();
    }
  },
  run: (): void => {
    if (requestAnimationFrameModule.addCounter <= 0) {
      return;
    }

    requestAnimationFrameModule.runCounter += 1;

    if (requestAnimationFrameModule.runCounter >= requestAnimationFrameModule.frameMount) {
      requestAnimationFrameModule.runCounter = 0;
      event.emit(requestAnimationFrameModule.key);
    }

    window.requestAnimationFrame(requestAnimationFrameModule.run);
  },
  stop: (): void => {
    requestAnimationFrameModule.addCounter = 0;
    requestAnimationFrameModule.isRun = false;
    event.removeListeners(requestAnimationFrameModule.key);
  },
};

const Scrollbar = forwardRef<ReactPerfectScrollbar, ScrollbarProps>(
  (props: PropsWithChildren<ScrollbarProps>, ref) => {
    const {
      className, isVerticalResident, isWindowsVerticalResident, isWindowsHorizontalResident, ...rest
    } = props;
    const clsNames = classNames(style.scrollbar, className, {
      'is-windows': isWindows,
      'is-vertical-resident': isVerticalResident || !!(isWindows && isWindowsVerticalResident),
      'is-horizontal-resident': !!(isWindows && isWindowsHorizontalResident),
    });
    const scrollbarRef = useRef<any>(null);

    const getScrollBarInstance = (instance: any): void => {
      scrollbarRef.current = instance;
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    };

    useEffect(() => {
      if (isWindows && (isWindowsHorizontalResident || isWindowsVerticalResident)) {
        requestAnimationFrameModule.add();
        event.on(requestAnimationFrameModule.key, () => {
          if (typeof getSafe(scrollbarRef.current, 'updateScroll') === 'function') {
            scrollbarRef.current.updateScroll();
          }
        });

        return (): void => {
          requestAnimationFrameModule.minus();
        };
      }
      return (): null => null;
    }, []);

    return (
      <ReactPerfectScrollbar className={clsNames} {...rest} ref={getScrollBarInstance}>
        {props.children}
      </ReactPerfectScrollbar>
    );
  },
);

Scrollbar.defaultProps = {
  isVerticalResident: false,
  isWindowsHorizontalResident: true,
  isWindowsVerticalResident: true,
};

export default Scrollbar;
