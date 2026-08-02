declare module "next/server" {
  export type NextRequest = any;
  export class NextResponse {
    static next(): any;
    static redirect(url: string, status?: number): any;
    static json(body: any, init?: ResponseInit): any;
  }
}

declare module "next/headers" {
  export function cookies(): any;
}
