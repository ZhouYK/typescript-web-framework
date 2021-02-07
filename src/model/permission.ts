import { gluer } from 'femo';

const initPermissions: { [index: string]: boolean } = null;

const permission = gluer(initPermissions);

export default {
  permission,
};
