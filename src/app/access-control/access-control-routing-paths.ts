import { getAccessControlModuleRoute } from '../app-routing-paths';
import { URLCombiner } from '../core/url-combiner/url-combiner';

export const GROUP_EDIT_PATH = 'groups';

export function getGroupsRoute() {
  return new URLCombiner(
    getAccessControlModuleRoute(),
    GROUP_EDIT_PATH
  ).toString();
}

export function getGroupEditRoute(id: string) {
  return new URLCombiner(
    getAccessControlModuleRoute(),
    GROUP_EDIT_PATH,
    id
  ).toString();
}
