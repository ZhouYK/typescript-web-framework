import { WuSongFormItemContext } from '@/pages/Demo/Wusong/interface';
import { gluer } from 'femo';
import React from 'react';

const WuSongFormItemContext = React.createContext<WuSongFormItemContext>(gluer(null));

export default WuSongFormItemContext;
