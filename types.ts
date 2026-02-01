
export type TreeMorphState = 'SCATTERED' | 'TREE_SHAPE';

export interface Ornament {
  id: string;
  position: [number, number, number];
  scatterPosition: [number, number, number];
  color: string;
  type: 'bauble' | 'star' | 'diamond';
}

export interface HolidayMessage {
  text: string;
  author: string;
}
