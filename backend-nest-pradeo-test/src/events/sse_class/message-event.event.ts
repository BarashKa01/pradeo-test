export interface MMessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
  }
  