import React from 'react';
import classnames from 'classnames';
import { Scrollbar } from '@zyk/components';
import { debounce, get, isArray } from 'lodash';
import Clamp from '../Clamp';
import { ExternalStageCount, PipelineProps, PipelineState, StageCount, ExternalStageCountId } from './interface';
import style from './style.less';
import Empty from '../Empty';
import ProgressDivider from '../../assets/svg/progress-divider.svg';
import PreSvg from '../../assets/svg/prev.svg';
import NextSvg from '../../assets/svg/next.svg';

class Pipeline extends React.Component<PipelineProps, PipelineState> {
  scrollOnEveryClick = 120;

  processList: any;

  processDom: any;

  state: PipelineState = {
    overflow: false,
    active: '',
  };

  static defaultProps = {
    // @ts-ignore
    external_count_list: [],
    // @ts-ignore
    stage_count_list: [],
    layout: 'default',
    mode: 'default',
  };

  constructor(props: PipelineProps) {
    super(props);
    this.processList = React.createRef();
  }

  static getDerivedStateFromProps(nextProps: PipelineProps, nextState: PipelineState) {
    const state: PipelineState = {
      prevProps: nextProps,
      overflow: nextState.overflow,
    };
    if (!('prevProps' in nextState) && 'defaultActive' in nextProps) {
      state.active = nextProps.defaultActive;
    } else if ('active' in nextProps) {
      state.active = nextProps.active;
    }
    return state;
  }

  isEmpty = (value: any) => {
    return value === null || value === undefined || value === '' || (isArray(value) && value.length === 0);
  };

  isResponse = () => this.props.layout === 'response';

  isInteractive = () => this.props.mode === 'interactive';

  isItemDisabled = (item: StageCount | ExternalStageCount) => get(item, 'disabled');

  onItemClick = (item: StageCount | ExternalStageCount) => () => {
    if (this.isItemDisabled(item)) return;
    this.setState({
      active: item,
    });
    if (this.props.onClick && this.isInteractive()) {
      this.props.onClick(get(item, 'stage_id'), item);
    }
  };

  getActiveItemId = () => {
    const { active } = this.state;
    if (
      typeof active === 'string' ||
      active === ExternalStageCountId.Active ||
      active === ExternalStageCountId.Reject
    ) {
      return active;
    }
    return get(active, 'stage_id');
  };

  genAProp = (item: StageCount | ExternalStageCount) => {
    const aProp: any = {};
    if (item.href) {
      aProp.href = item.href;
      aProp.rel = 'noreferrer noopener nofollow';
      aProp.target = item.target;
      aProp.className = 'pipeline-a-active';
    }
    return aProp;
  };

  renderMainProcess = () => {
    const { stage_count_list } = this.props;
    const result = stage_count_list || [];
    const count = result.length;
    const activeItemId = this.getActiveItemId();
    return result.map((stage: StageCount, index: number) => {
      const value = get(stage, 'count');
      const aProp = this.genAProp(stage);
      return (
        <li
          onClick={this.onItemClick(stage)}
          className={classnames('pipeline-process-list-item', {
            'pipeline-process-list-item-active':
              this.isInteractive() && !this.isItemDisabled(stage) && activeItemId === get(stage, 'stage_id'),
            'pipeline-process-list-item-disabled': this.isItemDisabled(stage),
          })}
          key={get(stage, 'stage_id')}
        >
          <a {...aProp}>
            <span className="pipeline-process-list-item-count">
              {this.isEmpty(value) ? <Empty /> : <Clamp label={`${value}`} />}
            </span>
            <span className="pipeline-process-list-item-name">
              <Clamp label={get(stage, 'stage_i18n_name') || get(stage, 'stage_name')} />
            </span>
            {index === count - 1 ? null : (
              <i className="pipeline-process-list-item-divider">
                <ProgressDivider />
              </i>
            )}
            {this.isInteractive() && !this.isItemDisabled(stage) ? (
              <span className="pipeline-process-list-item-flag" />
            ) : null}
          </a>
        </li>
      );
    });
  };

  detectOverflow = debounce(() => {
    if (this.processList.current) {
      this.processDom = this.processList.current._container;
      const { scrollWidth, offsetWidth } = this.processDom;
      let overflow = false;
      if (scrollWidth > offsetWidth) {
        overflow = true;
      }
      if (this.state.overflow !== overflow) {
        this.setState({
          overflow,
        });
      }
    }
  }, 20);

  componentDidMount(): void {
    this.detectOverflow();
    window.addEventListener('resize', this.detectOverflow);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.detectOverflow);
  }

  componentDidUpdate(preProps: PipelineProps): void {
    const preStageCountLength = get(preProps, 'stage_count_list.length') || 0;
    const curStageCountLength = get(this.props, 'stage_count_list.length') || 0;
    if (preStageCountLength !== curStageCountLength) {
      this.detectOverflow();
    }
  }

  animateMove = (direction: 'left' | 'right') => () => {
    const { scrollLeft } = this.processDom;
    this.move(direction, scrollLeft, this.scrollOnEveryClick);
  };

  move = (direction: 'left' | 'right', originScrollLeft: number, distance: number) => {
    if (direction === 'right') {
      this.processDom.scrollLeft = originScrollLeft + distance;
    }
    if (direction === 'left') {
      this.processDom.scrollLeft = originScrollLeft - distance;
    }
    // if (distance < this.scrollOnEveryClick) {
    //   window.requestAnimationFrame(() => {
    //     this.move(direction, originScrollLeft, distance + 10);
    //   });
    // }
  };

  renderPre = () => {
    return (
      <>
        <i
          onClick={this.animateMove('left')}
          className="pipeline-process-list-item-direction pipeline-process-list-item-pre"
        >
          <PreSvg />
        </i>
        <i className="pipeline-process-list-item-direction pipeline-process-list-item-pre-fake" />
      </>
    );
  };

  renderNext = () => {
    return (
      <>
        <i
          onClick={this.animateMove('right')}
          className="pipeline-process-list-item-direction pipeline-process-list-item-next"
        >
          <NextSvg />
        </i>
        <i className="pipeline-process-list-item-direction pipeline-process-list-item-next-fake" />
      </>
    );
  };

  renderExternal = () => {
    const { external_count_list } = this.props;
    const activeItemId = this.getActiveItemId();
    return external_count_list.map((item: ExternalStageCount) => {
      const aProp = this.genAProp(item);
      return (
        <section
          onClick={this.onItemClick(item)}
          key={get(item, 'stage_i18n_name')}
          className={classnames('pipeline-process-item-count-row', {
            'pipeline-process-item-count-row-active':
              this.isInteractive() && !this.isItemDisabled(item) && activeItemId === get(item, 'stage_id'),
            'pipeline-process-item-count-row-disabled': this.isItemDisabled(item),
          })}
        >
          <a {...aProp}>
            <span className="pipeline-process-item-count">
              {this.isEmpty(get(item, 'count')) ? <Empty /> : <Clamp label={`${get(item, 'count')}`} />}
            </span>
            <span className="pipeline-process-item-name">
              <Clamp label={get(item, 'stage_i18n_name')} />
            </span>
            {this.isInteractive() && !this.isItemDisabled(item) ? (
              <span className="pipeline-process-item-count-row-flag" />
            ) : null}
          </a>
        </section>
      );
    });
  };

  render() {
    const { overflow } = this.state;
    const { className } = this.props;
    return (
      <section
        className={classnames(style.pipeline, className, {
          'pipeline-interactive': this.isInteractive(),
          'pipeline-response': this.isResponse(),
        })}
      >
        <section className="pipeline-process-main">
          {overflow ? this.renderPre() : null}
          <Scrollbar ref={this.processList} /* options={{wheelPropagation: false}} */>
            <ul
              className={classnames('pipeline-process-list', {
                'pipeline-process-list-overflow': overflow,
              })}
            >
              {this.renderMainProcess()}
            </ul>
          </Scrollbar>

          {overflow ? this.renderNext() : null}
        </section>
        {this.renderExternal()}
      </section>
    );
  }
}

export default Pipeline;
