import Loadable from 'react-loadable';
import { Loader, LoaderProps } from "index";
export default (prefix: string, Loading: Loader<LoaderProps>) => (path: string) => Loadable({
  loader: () => import(`../../pages/${prefix}${path}`),
  loading: Loading,
  timeout: 10000
});
