import { gluer } from 'femo';
import { Flow } from '@src/pages/Three/Flow/interface';

const list = gluer<Flow.ResourceNode[]>([{
  id: '1',
  name: '测试1',
}, {
  id: '2',
  name: '测试2',
}, {
  id: '3',
  name: '测试3',
}]);

export default list;
