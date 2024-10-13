export interface htmlItem {
  url: string
  title: string
  width?: string
}

declare type AType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
declare type TSize = 'normal' | 'large';

export interface timeline {
  content: string
  time: string
  hollow?: boolean|undefined
  type?: AType
}

