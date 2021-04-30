import React, {
  FC, PropsWithChildren, useCallback, useEffect, useRef,
} from 'react';
import flv from 'flv.js';
import { Flow } from '@src/pages/Three/Flow/interface';
import { getSafe } from '@src/tools/util';
import { safeCrash } from '@src/hocs';
import style from './style.less';

interface Props {
  video: Flow.ResourceNode;
  type: 'flv' | 'mp4';
  getPlayer?: (playerRef: React.MutableRefObject<flv.Player>) => void;
  currentTime?: number;
}

const MAX_BUFFERED_TIME = 20 * 60;

const JSVideo: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    video, type, currentTime, getPlayer,
  } = props;

  const videoRef = useRef<HTMLVideoElement>();
  const player = useRef<flv.Player>(null);
  const canOperate = useRef(false);

  const playerError = useCallback(() => {
    console.log('player error');
  }, []);

  const playerMediaInfo = useCallback(() => {
    if (currentTime && videoRef.current) {
      videoRef.current.currentTime = currentTime || 0;
    }
  }, [currentTime]);

  const playerLoadingComplete = useCallback(() => {
    console.log('player loading complete');
  }, []);

  const onAllEvents = useCallback(() => {
    player.current.on(flv.Events.ERROR, playerError);
    player.current.on(flv.Events.MEDIA_INFO, playerMediaInfo);
    player.current.on(flv.Events.LOADING_COMPLETE, playerLoadingComplete);
  }, []);

  const offAllEvents = useCallback(() => {
    player.current.off(flv.Events.ERROR, playerError);
    player.current.off(flv.Events.MEDIA_INFO, playerMediaInfo);
    player.current.off(flv.Events.LOADING_COMPLETE, playerLoadingComplete);
  }, []);

  const reset = useCallback(() => {
    offAllEvents();
    player.current.unload();
    player.current.detachMediaElement();
    player.current.destroy();
    player.current = null;
  }, [offAllEvents]);

  useEffect(() => {
    const url = getSafe(video, 'url');
    player.current = flv.createPlayer({
      type,
      url,
    }, {
      lazyLoadMaxDuration: MAX_BUFFERED_TIME,
      autoCleanupMaxBackwardDuration: MAX_BUFFERED_TIME,
    });
    player.current.attachMediaElement(videoRef.current);
    if (url) {
      canOperate.current = true;
      player.current.load();
    } else {
      canOperate.current = false;
    }
    onAllEvents();
    return () => {
      reset();
    };
  }, [video, type]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime || 0;
    }
  }, [currentTime]);

  useEffect(() => {
    if (getPlayer) {
      getPlayer(player);
    }
  }, []);

  return (
    <section className={style.jsVideo}>
      <section className='video-control-layer'>
        <section className='video-title'>{getSafe(video, 'name')}</section>
      </section>
      <section className='video-wrap'>
        <video controls crossOrigin='anonymous' ref={videoRef} />
      </section>
    </section>
  );
};

export default safeCrash(JSVideo);
