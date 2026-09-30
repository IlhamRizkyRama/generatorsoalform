declare module 'mammoth' {
  export interface Image {
    read(encoding?: string): Promise<string | Buffer>;
    contentType: string;
  }

  export interface ConversionResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export interface ConvertOptions {
    arrayBuffer: ArrayBuffer;
    convertImage?: any;
    includeDefaultStyleMap?: boolean;
    styleMap?: string[];
  }

  export function convertToHtml(options: ConvertOptions): Promise<ConversionResult>;
  export function extractRawText(options: ConvertOptions): Promise<ConversionResult>;
  export const images: {
    dataUri(image: Image): Promise<{ src: string }>;
  };
}
