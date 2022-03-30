import { RouteComponentProps } from 'react-router-dom';

export interface BreadcrumbName {
  completePath: string;
  name: string | string[];
}

export interface Props extends RouteComponentProps {
  breadcrumbNameMap: BreadcrumbName[];
}
