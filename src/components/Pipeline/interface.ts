export interface ItemProps {
  disabled?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
}

export interface StageCount extends ItemProps {
  stage_id: string;
  stage_name?: string;
  stage_type?: number;
  count: number;
  stage_en_name?: string;
  stage_i18n_name: string;
}

export enum ExternalStageCountId {
  Active = 1, // 活跃中
  Reject = 2, // 已终止
}

export interface ExternalStageCount extends ItemProps {
  rel?: string;
  count: number;
  stage_i18n_name: string;
  stage_id: ExternalStageCountId;
  // active_status: ExternalStageCountId;
  stage_type?: string;
  stage_en_name?: string;
}

export interface PipelineProps {
  layout?: 'response' | 'default';
  stage_count_list: StageCount[]; // 流程数据
  external_count_list: ExternalStageCount[];
  onClick?: (id: string | ExternalStageCountId, item: StageCount | ExternalStageCount) => void;
  mode?: 'interactive' | 'default';
  defaultActive?: string | StageCount | ExternalStageCount;
  active?: string | ExternalStageCountId | StageCount | ExternalStageCount;
  className?: string;
}

export interface PipelineState {
  overflow: boolean; // 流程是否超出编辑
  active?: string | StageCount | ExternalStageCount | ExternalStageCountId;
  prevProps?: PipelineProps;
}

export type StageItem = StageCount | ExternalStageCount;
