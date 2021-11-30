import {
  FC, lazy, useEffect, useRef, useState,
} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  GluerReturn, ModelStatus, ServiceControl, useIndividualModel,
} from 'femo';

interface Props extends RouteComponentProps {
}

export interface ParallelInjectProps {
  control: GluerReturn<ServiceControl>;
}

interface ParallelService {
  (props: RouteComponentProps): Promise<any>;
}

/**
 *
 * @param componentPath 绝对路径
 * @param parallelService
 * @constructor
 */
const ParallelData: (componentPath: string, parallelService: ParallelService) => FC<Props> = (componentPath: string, parallelService: ParallelService) => (props: Props) => {
  const [path] = useState(() => (componentPath || '').replace(/^@src\//, ''));
  const srcPath = `@src/${path}`;
  const [, control] = useIndividualModel<ModelStatus>({
    loading: false,
    successful: false,
  });
  const unmountFlagRef = useRef(false);
  const [Component] = useState(() => {
    control.silent((_d, state) => ({
      ...state,
      loading: true,
      successful: false,
    }));
    parallelService(props).then(() => {
      if (unmountFlagRef.current) return;
      control.silent((_d, state) => ({
        ...state,
        loading: false,
        successful: true,
      }));
    }).catch(() => {
      if (unmountFlagRef.current) return;
      control.silent((_d, state) => ({
        ...state,
        loading: true,
        successful: false,
      }));
    });
    return lazy(() => import(srcPath));
  });

  useEffect(() => () => {
    unmountFlagRef.current = true;
  }, []);

  return <Component {...props} control={control} />;
};

export default ParallelData;
