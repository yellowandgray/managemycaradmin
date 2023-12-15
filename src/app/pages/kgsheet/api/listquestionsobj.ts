export interface ListQuestion {
  id?: string;
  qno: number;
  qstn: string;
  a?: string;
  a_name?: string;
  b?: string;
  b_name?: string;
  c?: string;
  c_name?: string;
  d?: string;
  d_name?: string;
  crtans?: string;
  [key: string]: string | number | undefined;
}
