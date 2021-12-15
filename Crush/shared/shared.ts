// utils 
import { TAG_TYPE } from './types'

// check a value is a primitive type or not  

function isPrimitiveType(val: any): boolean {
    return typeof val! == 'object'
}

// get the value type 


function typeOf(val: any): string {
    return Reflect.apply(Object.prototype.toString, val, []).slice(8, -1).toLowerCase()
}

// check a tag is a native html tag

const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,' +
    'summary,template,blockquote,iframe,tfoot';

// check a tag is a svg tag

const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
    'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
    'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
    'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
    'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
    'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
    'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
    'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
    'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
    'text,textPath,title,tspan,unknown,use,view';

const BUILDIN_TAGS = `if,elseIf,else,for,switch,case`

function splitStrToArr(target: string, divider: string) {
    return target.split(divider)
}

const HTML_TAGS_COLLECTION = splitStrToArr(HTML_TAGS, ',')
const SVG_TAGS_COLLECTION = splitStrToArr(SVG_TAGS, ',')
const BUILDIN_TAGS_COLLECTION = splitStrToArr(BUILDIN_TAGS, ',')


const cache = (fn: Function) => {
    const cache = Object.create(null);
    return ((str: string) => {
        const cached = cache[str];
        return cached || (cache[str] = fn(str));
    });
};


const camelize = cache((str: string) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : ''
    }); 
});

function isHTMLTag(tagName: string) {
    return HTML_TAGS_COLLECTION.includes(camelize(tagName))
}

function isSVGTag(tagName: string) {
    return SVG_TAGS_COLLECTION.includes(camelize(tagName))
}

function isBUILDINTag(tagName: string) {
    return BUILDIN_TAGS_COLLECTION.includes(camelize(tagName))
}


const getTheTagType = cache((tagName: string) => {
    return isHTMLTag(tagName) ?
        TAG_TYPE.HTMLELEMENT :
        isBUILDINTag(tagName) ?
            TAG_TYPE.BUILDIN_TAG :
            isSVGTag(tagName) ?
                TAG_TYPE.SVGELEMENT :
                TAG_TYPE.COMPONENT
})


export {
    isPrimitiveType,
    typeOf,
    isHTMLTag,
    camelize,
    getTheTagType
}

