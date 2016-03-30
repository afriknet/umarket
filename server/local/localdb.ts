/// <reference path="../lib/types.ts" />

import Types = require('../lib/types');


export var SpecsAttribs: Types.SpecificAttributes = {

    "colors": {
        spectype: Types.SpecsType.enum_list,
        valuetype: Types.ValueType.color,
        display: 'couleurs',
        values: [
            { name: 'rouge', value:'red' }
        ]
    },

    "tailles": {
        display: 'taille',
        spectype: Types.SpecsType.enum_list,
        valuetype: Types.ValueType.text,
        values: [
            { name: 'normal' },
            { name: 'large' },
            { name: 'extra-large' }
        ]
    },

    "mobiles": {
        display:'marques portable',
        spectype: Types.SpecsType.enum_list,        
        values: [
            {
                name: 'iphone',                
                subvalues: [
                    { name: 'iphone 4', value:'iph4' },
                    { name: 'iphone 4S', value: 'iph4s' },
                    { name: 'iphone 5', value: 'iph5' },
                    { name: 'iphone 5c', value: 'iph5c' },
                    { name: 'iphone 5s', value: 'iph5s' },
                    { name: 'iphone 6', value: 'iph6' },
                    { name: 'iphone 6 Plus', value: 'iph6+' },
                    { name: 'iphone 6s', value: 'iph6s' },
                    { name: 'iphone 6s Plus', value: 'iph6s+' },
                ]
            },
            {
                name: 'nokia'
            },
            {
                name: 'samsung', subvalues: [
                ]
            },
        ]
    },
    
    "cars": {
        display: 'marques auto',
        spectype: Types.SpecsType.enum_list,
        valuetype: Types.ValueType.text,
        values: [
            { name: 'peugeot' },
            { name: 'toyota' },
            { name: 'citroen' },
            { name: 'renault' },
            { name: 'kia' },
            { name: 'mercedes' },
        ]
    }
}



export var Categories: Types.Categories = {
    "fashion-men": {
        display: 'Homme',
        subs: {
            "accessories": { display: 'accessoires' },
            "Jackets": {},
            "Jumpers": {},
            "Jeans": {},
            "Chaussures": {},
            "TShirtsPolo": { display:'T-Shirt & Polo Shirts' },
        },
        specs: ["colors", "tailles"]  
    },

    "fashion-women": {
        display: 'Femme',
        subs: {
            "accessories": { display: 'accessoires' },
            "Swimwear": {},
            "Basics": {},
            "Dresses": {},
            "Jeans": {},
            "Skirts": {},
            "Leggins": {},
        },
        specs: ["colors", "tailles"]  
    },
    "accessories": {
        display: 'Accessoires',
        subs: {
            "Sunglasses": {},
            "Watches": {},
            "Umbrellas": {},
            "Bags & Wallets": { display: 'Bags & Wallets' },
            "Fashion Jewellery": {},
            "Belts": {}
        }
    }
}


export var Partners: Types.Partners = {
    'amazon': {
        url:'www.amazon.com'
    }
}