import React from 'react';
import { FormNode } from '../interface';

// const WuSongFormContextCons = React.createContext<WuSongFormContext>({
//   form: gluer({}),
//   fields: new Map(),
//   subscriptions: new Map(),
// });
const WuSongFormContextCons = React.createContext<FormNode>(null);

export default WuSongFormContextCons;
