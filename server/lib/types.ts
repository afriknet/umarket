
export interface SpecsValue {
    name: string,
    display?: string,
    value?: string,
    subvalues?: SpecsValue[]
}

export enum SpecsType { enum_list }
export enum ValueType { text, number, date, price, bool, color }

export interface SpecsInfo {
    spectype: SpecsType,
    valuetype?: ValueType,
    display?: string,
    values: SpecsValue[]
}


export interface SpecificAttributes {
    [spec: string]: SpecsInfo
}


export interface CategoryInfo {    
    display?: string,
    specs?: string[],
    subs?: {
        [name: string]: CategoryInfo
    }
}


export interface Categories {
    [name: string]: CategoryInfo
}



export interface PartnerInfo {    
    url: string
}


export interface Partners {
    [name: string]: PartnerInfo
}
