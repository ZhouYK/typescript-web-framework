import { gluer } from 'femo';
import { Flow } from '@src/pages/Three/Flow/interface';

const list = gluer<Flow.ResourceNode[]>([{
  id: '1',
  name: '测试1',
  url: 'http://localhost:8989/video/1.mp4',
}, {
  id: '2',
  name: '测试2',
  url: 'http://localhost:8989/video/2.mp4',
}, {
  id: '3',
  name: '测试3',
  url: 'http://localhost:8989/video/3.mp4',
}]);

export default list;
