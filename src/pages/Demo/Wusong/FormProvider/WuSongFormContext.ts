import React from 'react';
import { WuSongFormContext } from '../interface';

const WuSongFormContextCons = React.createContext<WuSongFormContext>({
  fields: new Map(),
  subscriptions: new Map(),
});

export default WuSongFormContextCons;
