export interface ListQuestion {
    id?: string;
    qno: number;
    qstn: string;
    a?: string;
    b?: string;
    c?: string;
    d?: string;
    crtans?: string;
    [key: string]: string | number | undefined;
  }
