import React, {
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import flv from 'flv.js';
import { Flow } from '@src/pages/Three/Flow/interface';
import { getSafe } from '@src/tools/util';
import { safeCrash } from '@src/hocs';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import style from './style.less';

interface Props {
  video: Flow.ResourceNode;
  type: 'flv' | 'mp4';
}

const JSVideo: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { video, type } = props;

  const videoRef = useRef<HTMLVideoElement>();
  const player = useRef<flv.Player>(null);
  const [playFlag, updatePlayFlag] = useState(false);

  const playerError = useCallback(() => {
    console.log('player error');
  }, []);

  const playerLoadingComplete = useCallback(() => {
    console.log('player loading complete');
  }, []);

  const playerRecoveredEarlyEof = useCallback(() => {
    console.log('player recovered early eof');
  }, []);

  const playerMediaInfo = useCallback(() => {
    console.log('player media info', player.current.mediaInfo);
  }, []);

  const playerMetaDataArrived = useCallback(() => {
    console.log('player meta data arrived');
  }, []);

  const playerScriptDataArrived = useCallback(() => {
    console.log('player script data arrived');
  }, []);

  const playerStaticsInfo = useCallback(() => {
    // console.log('player statics info');
  }, []);

  const onAllEvents = useCallback(() => {
    player.current.on(flv.Events.ERROR, playerError);
    player.current.on(flv.Events.LOADING_COMPLETE, playerLoadingComplete);
    player.current.on(flv.Events.RECOVERED_EARLY_EOF, playerRecoveredEarlyEof);
    player.current.on(flv.Events.MEDIA_INFO, playerMediaInfo);
    player.current.on(flv.Events.METADATA_ARRIVED, playerMetaDataArrived);
    player.current.on(flv.Events.SCRIPTDATA_ARRIVED, playerScriptDataArrived);
    player.current.on(flv.Events.STATISTICS_INFO, playerStaticsInfo);
  }, []);

  const offAllEvents = useCallback(() => {
    player.current.off(flv.Events.ERROR, playerError);
    player.current.off(flv.Events.LOADING_COMPLETE, playerLoadingComplete);
    player.current.off(flv.Events.RECOVERED_EARLY_EOF, playerRecoveredEarlyEof);
    player.current.off(flv.Events.MEDIA_INFO, playerMediaInfo);
    player.current.off(flv.Events.METADATA_ARRIVED, playerMetaDataArrived);
    player.current.off(flv.Events.SCRIPTDATA_ARRIVED, playerScriptDataArrived);
    player.current.off(flv.Events.STATISTICS_INFO, playerStaticsInfo);
  }, []);

  useEffect(() => {
    const url = getSafe(video, 'url');
    const timer = setInterval(() => {
      console.log('duration', player.current.duration);
      console.log('buffered', player.current.buffered.start(0), player.current.buffered.end(0));
      console.log('currentTime', player.current.currentTime);
    }, 3000);
    player.current = flv.createPlayer({
      type,
      url,
    }, {
      stashInitialSize: 10240,
    });
    player.current.attachMediaElement(videoRef.current);
    if (url) {
      player.current.load();
    }
    onAllEvents();
    return () => {
      clearInterval(timer);
      offAllEvents();
      player.current.unload();
      player.current.detachMediaElement();
      player.current.destroy();
      player.current = null;
    };
  }, [video, type]);

  const play = useCallback(() => {
    player.current.play();
    updatePlayFlag(true);
  }, []);

  const pause = useCallback(() => {
    player.current.pause();
    updatePlayFlag(false);
  }, []);

  return (
    <section className={style.jsVideo}>
      <section className='video-wrap'>
        <video crossOrigin='anonymous' ref={videoRef} />
      </section>
      <section className='video-control-layer'>
        <section className='video-title'>{getSafe(video, 'name')}</section>
        <section className='control-rows'>
          <section className='play-pause'>
            { playFlag ? <PauseOutlined onClick={pause} /> : <CaretRightOutlined onClick={play} /> }
          </section>
        </section>
      </section>
    </section>
  );
};

export default safeCrash(JSVideo);
