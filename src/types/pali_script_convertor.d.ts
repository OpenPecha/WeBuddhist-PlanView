declare module "pali_script_convertor" {
  export const SCRIPTS: {
    readonly SI: "si"
    readonly HI: "hi"
    readonly RO: "ro"
    readonly THAI: "th"
    readonly LAOS: "lo"
    readonly MY: "my"
    readonly KM: "km"
    readonly BENG: "be"
    readonly ASSE: "as"
    readonly GURM: "gm"
    readonly THAM: "tt"
    readonly GUJA: "gj"
    readonly TELU: "te"
    readonly KANN: "ka"
    readonly MALA: "mm"
    readonly BRAH: "br"
    readonly TIBT: "tb"
    readonly CYRL: "cy"
  }

  export type PaliScript = (typeof SCRIPTS)[keyof typeof SCRIPTS]

  export function convertPali(
    text: string,
    toScript: PaliScript,
    fromScript?: PaliScript | null
  ): string
}
