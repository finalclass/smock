var A=function(X,Y,Z,$){var K=arguments.length,G=K<3?Y:$===null?$=Object.getOwnPropertyDescriptor(Y,Z):$,H;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")G=Reflect.decorate(X,Y,Z,$);else for(var Q=X.length-1;Q>=0;Q--)if(H=X[Q])G=(K<3?H(G):K>3?H(Y,Z,G):H(Y,Z))||G;return K>3&&G&&Object.defineProperty(Y,Z,G),G};var l=globalThis,XX=l.ShadowRoot&&(l.ShadyCSS===void 0||l.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,YX=Symbol(),kX=new WeakMap;class ZX{constructor(X,Y,Z){if(this._$cssResult$=!0,Z!==YX)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=X,this._strings=Y}get styleSheet(){let X=this._styleSheet,Y=this._strings;if(XX&&X===void 0){let Z=Y!==void 0&&Y.length===1;if(Z)X=kX.get(Y);if(X===void 0){if((this._styleSheet=X=new CSSStyleSheet).replaceSync(this.cssText),Z)kX.set(Y,X)}}return X}toString(){return this.cssText}}var uX=(X)=>{if(X._$cssResult$===!0)return X.cssText;else if(typeof X==="number")return X;else throw Error(`Value passed to 'css' function must be a 'css' function result: ${X}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)},pX=(X)=>new ZX(typeof X==="string"?X:String(X),void 0,YX),jX=(X,...Y)=>{let Z=X.length===1?X[0]:Y.reduce(($,K,G)=>$+uX(K)+X[G+1],X[0]);return new ZX(Z,X,YX)},fX=(X,Y)=>{if(XX)X.adoptedStyleSheets=Y.map((Z)=>Z instanceof CSSStyleSheet?Z:Z.styleSheet);else for(let Z of Y){let $=document.createElement("style"),K=l.litNonce;if(K!==void 0)$.setAttribute("nonce",K);$.textContent=Z.cssText,X.appendChild($)}},iX=(X)=>{let Y="";for(let Z of X.cssRules)Y+=Z.cssText;return pX(Y)},$X=XX?(X)=>X:(X)=>X instanceof CSSStyleSheet?iX(X):X;var{is:lX,defineProperty:sX,getOwnPropertyDescriptor:_X,getOwnPropertyNames:oX,getOwnPropertySymbols:rX,getPrototypeOf:AX}=Object,nX=!1,U=globalThis;if(nX)U.customElements??=customElements;var k=!0,M,MX=U.trustedTypes,aX=MX?MX.emptyScript:"",NX=k?U.reactiveElementPolyfillSupportDevMode:U.reactiveElementPolyfillSupport;if(k)U.litIssuedWarnings??=new Set,M=(X,Y)=>{if(Y+=` See https://lit.dev/msg/${X} for more information.`,!U.litIssuedWarnings.has(Y)&&!U.litIssuedWarnings.has(X))console.warn(Y),U.litIssuedWarnings.add(Y)},queueMicrotask(()=>{if(M("dev-mode","Lit is in dev mode. Not recommended for production!"),U.ShadyDOM?.inUse&&NX===void 0)M("polyfill-support-missing","Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.")});var tX=k?(X)=>{if(!U.emitLitDebugLogEvents)return;U.dispatchEvent(new CustomEvent("lit-debug",{detail:X}))}:void 0,h=(X,Y)=>X,x={toAttribute(X,Y){switch(Y){case Boolean:X=X?aX:null;break;case Object:case Array:X=X==null?X:JSON.stringify(X);break}return X},fromAttribute(X,Y){let Z=X;switch(Y){case Boolean:Z=X!==null;break;case Number:Z=X===null?null:Number(X);break;case Object:case Array:try{Z=JSON.parse(X)}catch($){Z=null}break}return Z}},s=(X,Y)=>!lX(X,Y),IX={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:s};Symbol.metadata??=Symbol("metadata");U.litPropertyMetadata??=new WeakMap;class j extends HTMLElement{static addInitializer(X){this.__prepare(),(this._initializers??=[]).push(X)}static get observedAttributes(){return this.finalize(),this.__attributeToPropertyMap&&[...this.__attributeToPropertyMap.keys()]}static createProperty(X,Y=IX){if(Y.state)Y.attribute=!1;if(this.__prepare(),this.prototype.hasOwnProperty(X))Y=Object.create(Y),Y.wrapped=!0;if(this.elementProperties.set(X,Y),!Y.noAccessor){let Z=k?Symbol.for(`${String(X)} (@property() cache)`):Symbol(),$=this.getPropertyDescriptor(X,Z,Y);if($!==void 0)sX(this.prototype,X,$)}}static getPropertyDescriptor(X,Y,Z){let{get:$,set:K}=_X(this.prototype,X)??{get(){return this[Y]},set(G){this[Y]=G}};if(k&&$==null){if("value"in(_X(this.prototype,X)??{}))throw Error(`Field ${JSON.stringify(String(X))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);M("reactive-property-without-getter",`Field ${JSON.stringify(String(X))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`)}return{get:$,set(G){let H=$?.call(this);K?.call(this,G),this.requestUpdate(X,H,Z)},configurable:!0,enumerable:!0}}static getPropertyOptions(X){return this.elementProperties.get(X)??IX}static __prepare(){if(this.hasOwnProperty(h("elementProperties",this)))return;let X=AX(this);if(X.finalize(),X._initializers!==void 0)this._initializers=[...X._initializers];this.elementProperties=new Map(X.elementProperties)}static finalize(){if(this.hasOwnProperty(h("finalized",this)))return;if(this.finalized=!0,this.__prepare(),this.hasOwnProperty(h("properties",this))){let Y=this.properties,Z=[...oX(Y),...rX(Y)];for(let $ of Z)this.createProperty($,Y[$])}let X=this[Symbol.metadata];if(X!==null){let Y=litPropertyMetadata.get(X);if(Y!==void 0)for(let[Z,$]of Y)this.elementProperties.set(Z,$)}this.__attributeToPropertyMap=new Map;for(let[Y,Z]of this.elementProperties){let $=this.__attributeNameForProperty(Y,Z);if($!==void 0)this.__attributeToPropertyMap.set($,Y)}if(this.elementStyles=this.finalizeStyles(this.styles),k){if(this.hasOwnProperty("createProperty"))M("no-override-create-property","Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");if(this.hasOwnProperty("getPropertyDescriptor"))M("no-override-get-property-descriptor","Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators")}}static finalizeStyles(X){let Y=[];if(Array.isArray(X)){let Z=new Set(X.flat(1/0).reverse());for(let $ of Z)Y.unshift($X($))}else if(X!==void 0)Y.push($X(X));return Y}static __attributeNameForProperty(X,Y){let Z=Y.attribute;return Z===!1?void 0:typeof Z==="string"?Z:typeof X==="string"?X.toLowerCase():void 0}constructor(){super();this.__instanceProperties=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.__reflectingProperty=null,this.__initialize()}__initialize(){this.__updatePromise=new Promise((X)=>this.enableUpdating=X),this._$changedProperties=new Map,this.__saveInstanceProperties(),this.requestUpdate(),this.constructor._initializers?.forEach((X)=>X(this))}addController(X){if((this.__controllers??=new Set).add(X),this.renderRoot!==void 0&&this.isConnected)X.hostConnected?.()}removeController(X){this.__controllers?.delete(X)}__saveInstanceProperties(){let X=new Map,Y=this.constructor.elementProperties;for(let Z of Y.keys())if(this.hasOwnProperty(Z))X.set(Z,this[Z]),delete this[Z];if(X.size>0)this.__instanceProperties=X}createRenderRoot(){let X=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fX(X,this.constructor.elementStyles),X}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.__controllers?.forEach((X)=>X.hostConnected?.())}enableUpdating(X){}disconnectedCallback(){this.__controllers?.forEach((X)=>X.hostDisconnected?.())}attributeChangedCallback(X,Y,Z){this._$attributeToProperty(X,Z)}__propertyToAttribute(X,Y){let $=this.constructor.elementProperties.get(X),K=this.constructor.__attributeNameForProperty(X,$);if(K!==void 0&&$.reflect===!0){let H=($.converter?.toAttribute!==void 0?$.converter:x).toAttribute(Y,$.type);if(k&&this.constructor.enabledWarnings.includes("migration")&&H===void 0)M("undefined-attribute-value",`The attribute value for the ${X} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);if(this.__reflectingProperty=X,H==null)this.removeAttribute(K);else this.setAttribute(K,H);this.__reflectingProperty=null}}_$attributeToProperty(X,Y){let Z=this.constructor,$=Z.__attributeToPropertyMap.get(X);if($!==void 0&&this.__reflectingProperty!==$){let K=Z.getPropertyOptions($),G=typeof K.converter==="function"?{fromAttribute:K.converter}:K.converter?.fromAttribute!==void 0?K.converter:x;this.__reflectingProperty=$;let H=G.fromAttribute(Y,K.type);this[$]=H??this.__defaultValues?.get($)??H,this.__reflectingProperty=null}}requestUpdate(X,Y,Z,$=!1,K){if(X!==void 0){if(k&&X instanceof Event)M("","The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()");let G=this.constructor;if($===!1)K=this[X];if(Z??=G.getPropertyOptions(X),(Z.hasChanged??s)(K,Y)||Z.useDefault&&Z.reflect&&K===this.__defaultValues?.get(X)&&!this.hasAttribute(G.__attributeNameForProperty(X,Z)))this._$changeProperty(X,Y,Z);else return}if(this.isUpdatePending===!1)this.__updatePromise=this.__enqueueUpdate()}_$changeProperty(X,Y,{useDefault:Z,reflect:$,wrapped:K},G){if(Z&&!(this.__defaultValues??=new Map).has(X)){if(this.__defaultValues.set(X,G??Y??this[X]),K!==!0||G!==void 0)return}if(!this._$changedProperties.has(X)){if(!this.hasUpdated&&!Z)Y=void 0;this._$changedProperties.set(X,Y)}if($===!0&&this.__reflectingProperty!==X)(this.__reflectingProperties??=new Set).add(X)}async __enqueueUpdate(){this.isUpdatePending=!0;try{await this.__updatePromise}catch(Y){Promise.reject(Y)}let X=this.scheduleUpdate();if(X!=null)await X;return!this.isUpdatePending}scheduleUpdate(){let X=this.performUpdate();if(k&&this.constructor.enabledWarnings.includes("async-perform-update")&&typeof X?.then==="function")M("async-perform-update",`Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);return X}performUpdate(){if(!this.isUpdatePending)return;if(tX?.({kind:"update"}),!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),k){let K=[...this.constructor.elementProperties.keys()].filter((G)=>this.hasOwnProperty(G)&&(G in AX(this)));if(K.length)throw Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${K.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`)}if(this.__instanceProperties){for(let[$,K]of this.__instanceProperties)this[$]=K;this.__instanceProperties=void 0}let Z=this.constructor.elementProperties;if(Z.size>0)for(let[$,K]of Z){let{wrapped:G}=K,H=this[$];if(G===!0&&!this._$changedProperties.has($)&&H!==void 0)this._$changeProperty($,void 0,K,H)}}let X=!1,Y=this._$changedProperties;try{if(X=this.shouldUpdate(Y),X)this.willUpdate(Y),this.__controllers?.forEach((Z)=>Z.hostUpdate?.()),this.update(Y);else this.__markUpdated()}catch(Z){throw X=!1,this.__markUpdated(),Z}if(X)this._$didUpdate(Y)}willUpdate(X){}_$didUpdate(X){if(this.__controllers?.forEach((Y)=>Y.hostUpdated?.()),!this.hasUpdated)this.hasUpdated=!0,this.firstUpdated(X);if(this.updated(X),k&&this.isUpdatePending&&this.constructor.enabledWarnings.includes("change-in-update"))M("change-in-update",`Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`)}__markUpdated(){this._$changedProperties=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.__updatePromise}shouldUpdate(X){return!0}update(X){this.__reflectingProperties&&=this.__reflectingProperties.forEach((Y)=>this.__propertyToAttribute(Y,this[Y])),this.__markUpdated()}updated(X){}firstUpdated(X){}}j.elementStyles=[];j.shadowRootOptions={mode:"open"};j[h("elementProperties",j)]=new Map;j[h("finalized",j)]=new Map;NX?.({ReactiveElement:j});if(k){j.enabledWarnings=["change-in-update","async-perform-update"];let X=function(Y){if(!Y.hasOwnProperty(h("enabledWarnings",Y)))Y.enabledWarnings=Y.enabledWarnings.slice()};j.enableWarning=function(Y){if(X(this),!this.enabledWarnings.includes(Y))this.enabledWarnings.push(Y)},j.disableWarning=function(Y){X(this);let Z=this.enabledWarnings.indexOf(Y);if(Z>=0)this.enabledWarnings.splice(Z,1)}}(U.reactiveElementVersions??=[]).push("2.1.2");if(k&&U.reactiveElementVersions.length>1)queueMicrotask(()=>{M("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var f=globalThis,J=(X)=>{if(!f.emitLitDebugLogEvents)return;f.dispatchEvent(new CustomEvent("lit-debug",{detail:X}))},eX=0,v;f.litIssuedWarnings??=new Set,v=(X,Y)=>{if(Y+=X?` See https://lit.dev/msg/${X} for more information.`:"",!f.litIssuedWarnings.has(Y)&&!f.litIssuedWarnings.has(X))console.warn(Y),f.litIssuedWarnings.add(Y)},queueMicrotask(()=>{v("dev-mode","Lit is in dev mode. Not recommended for production!")});var I=f.ShadyDOM?.inUse&&f.ShadyDOM?.noPatch===!0?f.ShadyDOM.wrap:(X)=>X,o=f.trustedTypes,VX=o?o.createPolicy("lit-html",{createHTML:(X)=>X}):void 0,XY=(X)=>X,t=(X,Y,Z)=>XY,YY=(X)=>{if(P!==t)throw Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");P=X},ZY=()=>{P=t},JX=(X,Y,Z)=>{return P(X,Y,Z)},OX="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,bX="?"+V,$Y=`<${bX}>`,O=document,g=()=>O.createComment(""),m=(X)=>X===null||typeof X!="object"&&typeof X!="function",zX=Array.isArray,KY=(X)=>zX(X)||typeof X?.[Symbol.iterator]==="function",KX=`[ 	
\f\r]`,GY=`[^ 	
\f\r"'\`<>=]`,HY=`[^\\s"'>=/]`,c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,TX=1,GX=2,QY=3,CX=/-->/g,DX=/>/g,D=new RegExp(`>|${KX}(?:(${HY}+)(${KX}*=${KX}*(?:${GY}|("|')|))|$)`,"g"),JY=0,SX=1,zY=2,LX=3,HX=/'/g,QX=/"/g,PX=/^(?:script|style|textarea|title)$/i,BY=1,r=2,n=3,BX=1,a=2,FY=3,qY=4,WY=5,FX=6,UY=7,qX=(X)=>(Y,...Z)=>{if(Y.some(($)=>$===void 0))console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`);if(Z.some(($)=>$?._$litStatic$))v("",`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);return{["_$litType$"]:X,strings:Y,values:Z}},_=qX(BY),OY=qX(r),bY=qX(n),b=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),RX=new WeakMap,R=O.createTreeWalker(O,129),P=t;function wX(X,Y){if(!zX(X)||!X.hasOwnProperty("raw")){let Z="invalid template strings array";throw Z=`
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g,`
`),Error(Z)}return VX!==void 0?VX.createHTML(Y):Y}var kY=(X,Y)=>{let Z=X.length-1,$=[],K=Y===r?"<svg>":Y===n?"<math>":"",G,H=c;for(let B=0;B<Z;B++){let N=X[B],z=-1,W,C=0,q;while(C<N.length){if(H.lastIndex=C,q=H.exec(N),q===null)break;if(C=H.lastIndex,H===c){if(q[TX]==="!--")H=CX;else if(q[TX]!==void 0)H=DX;else if(q[GX]!==void 0){if(PX.test(q[GX]))G=new RegExp(`</${q[GX]}`,"g");H=D}else if(q[QY]!==void 0)throw Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions")}else if(H===D)if(q[JY]===">")H=G??c,z=-1;else if(q[SX]===void 0)z=-2;else z=H.lastIndex-q[zY].length,W=q[SX],H=q[LX]===void 0?D:q[LX]==='"'?QX:HX;else if(H===QX||H===HX)H=D;else if(H===CX||H===DX)H=c;else H=D,G=void 0}console.assert(z===-1||H===D||H===HX||H===QX,"unexpected parse state B");let L=H===D&&X[B+1].startsWith("/>")?" ":"";K+=H===c?N+$Y:z>=0?($.push(W),N.slice(0,z)+OX+N.slice(z))+V+L:N+V+(z===-2?B:L)}let Q=K+(X[Z]||"<?>")+(Y===r?"</svg>":Y===n?"</math>":"");return[wX(X,Q),$]};class u{constructor({strings:X,["_$litType$"]:Y},Z){this.parts=[];let $,K=0,G=0,H=X.length-1,Q=this.parts,[B,N]=kY(X,Y);if(this.el=u.createElement(B,Z),R.currentNode=this.el.content,Y===r||Y===n){let z=this.el.content.firstChild;z.replaceWith(...z.childNodes)}while(($=R.nextNode())!==null&&Q.length<H){if($.nodeType===1){{let z=$.localName;if(/^(?:textarea|template)$/i.test(z)&&$.innerHTML.includes(V)){let W=`Expressions are not supported inside \`${z}\` elements. See https://lit.dev/msg/expression-in-${z} for more information.`;if(z==="template")throw Error(W);else v("",W)}}if($.hasAttributes()){for(let z of $.getAttributeNames())if(z.endsWith(OX)){let W=N[G++],q=$.getAttribute(z).split(V),L=/([.?@])?(.*)/.exec(W);Q.push({type:BX,index:K,name:L[2],strings:q,ctor:L[1]==="."?yX:L[1]==="?"?EX:L[1]==="@"?xX:i}),$.removeAttribute(z)}else if(z.startsWith(V))Q.push({type:FX,index:K}),$.removeAttribute(z)}if(PX.test($.tagName)){let z=$.textContent.split(V),W=z.length-1;if(W>0){$.textContent=o?o.emptyScript:"";for(let C=0;C<W;C++)$.append(z[C],g()),R.nextNode(),Q.push({type:a,index:++K});$.append(z[W],g())}}}else if($.nodeType===8)if($.data===bX)Q.push({type:a,index:K});else{let W=-1;while((W=$.data.indexOf(V,W+1))!==-1)Q.push({type:UY,index:K}),W+=V.length-1}K++}if(N.length!==G)throw Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`'+X.join("${...}")+"`");J&&J({kind:"template prep",template:this,clonableTemplate:this.el,parts:this.parts,strings:X})}static createElement(X,Y){let Z=O.createElement("template");return Z.innerHTML=X,Z}}function y(X,Y,Z=X,$){if(Y===b)return Y;let K=$!==void 0?Z.__directives?.[$]:Z.__directive,G=m(Y)?void 0:Y._$litDirective$;if(K?.constructor!==G){if(K?._$notifyDirectiveConnectionChanged?.(!1),G===void 0)K=void 0;else K=new G(X),K._$initialize(X,Z,$);if($!==void 0)(Z.__directives??=[])[$]=K;else Z.__directive=K}if(K!==void 0)Y=y(X,K._$resolve(X,Y.values),K,$);return Y}class hX{constructor(X,Y){this._$parts=[],this._$disconnectableChildren=void 0,this._$template=X,this._$parent=Y}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone(X){let{el:{content:Y},parts:Z}=this._$template,$=(X?.creationScope??O).importNode(Y,!0);R.currentNode=$;let K=R.nextNode(),G=0,H=0,Q=Z[0];while(Q!==void 0){if(G===Q.index){let B;if(Q.type===a)B=new p(K,K.nextSibling,this,X);else if(Q.type===BX)B=new Q.ctor(K,Q.name,Q.strings,this,X);else if(Q.type===FX)B=new cX(K,this,X);this._$parts.push(B),Q=Z[++H]}if(G!==Q?.index)K=R.nextNode(),G++}return R.currentNode=O,$}_update(X){let Y=0;for(let Z of this._$parts){if(Z!==void 0)if(J&&J({kind:"set part",part:Z,value:X[Y],valueIndex:Y,values:X,templateInstance:this}),Z.strings!==void 0)Z._$setValue(X,Z,Y),Y+=Z.strings.length-2;else Z._$setValue(X[Y]);Y++}}}class p{get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor(X,Y,Z,$){this.type=a,this._$committedValue=F,this._$disconnectableChildren=void 0,this._$startNode=X,this._$endNode=Y,this._$parent=Z,this.options=$,this.__isConnected=$?.isConnected??!0,this._textSanitizer=void 0}get parentNode(){let X=I(this._$startNode).parentNode,Y=this._$parent;if(Y!==void 0&&X?.nodeType===11)X=Y.parentNode;return X}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue(X,Y=this){if(this.parentNode===null)throw Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");if(X=y(this,X,Y),m(X)){if(X===F||X==null||X===""){if(this._$committedValue!==F)J&&J({kind:"commit nothing to child",start:this._$startNode,end:this._$endNode,parent:this._$parent,options:this.options}),this._$clear();this._$committedValue=F}else if(X!==this._$committedValue&&X!==b)this._commitText(X)}else if(X._$litType$!==void 0)this._commitTemplateResult(X);else if(X.nodeType!==void 0){if(this.options?.host===X){this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"),console.warn("Attempted to render the template host",X,"inside itself. This is almost always a mistake, and in dev mode ","we render some warning text. In production however, we'll ","render it, which will usually result in an error, and sometimes ","in the element disappearing from the DOM.");return}this._commitNode(X)}else if(KY(X))this._commitIterable(X);else this._commitText(X)}_insert(X){return I(I(this._$startNode).parentNode).insertBefore(X,this._$endNode)}_commitNode(X){if(this._$committedValue!==X){if(this._$clear(),P!==t){let Y=this._$startNode.parentNode?.nodeName;if(Y==="STYLE"||Y==="SCRIPT"){let Z="Forbidden";if(Y==="STYLE")Z="Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.";else Z="Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.";throw Error(Z)}}J&&J({kind:"commit node",start:this._$startNode,parent:this._$parent,value:X,options:this.options}),this._$committedValue=this._insert(X)}}_commitText(X){if(this._$committedValue!==F&&m(this._$committedValue)){let Y=I(this._$startNode).nextSibling;if(this._textSanitizer===void 0)this._textSanitizer=JX(Y,"data","property");X=this._textSanitizer(X),J&&J({kind:"commit text",node:Y,value:X,options:this.options}),Y.data=X}else{let Y=O.createTextNode("");if(this._commitNode(Y),this._textSanitizer===void 0)this._textSanitizer=JX(Y,"data","property");X=this._textSanitizer(X),J&&J({kind:"commit text",node:Y,value:X,options:this.options}),Y.data=X}this._$committedValue=X}_commitTemplateResult(X){let{values:Y,["_$litType$"]:Z}=X,$=typeof Z==="number"?this._$getTemplate(X):(Z.el===void 0&&(Z.el=u.createElement(wX(Z.h,Z.h[0]),this.options)),Z);if(this._$committedValue?._$template===$)J&&J({kind:"template updating",template:$,instance:this._$committedValue,parts:this._$committedValue._$parts,options:this.options,values:Y}),this._$committedValue._update(Y);else{let K=new hX($,this),G=K._clone(this.options);J&&J({kind:"template instantiated",template:$,instance:K,parts:K._$parts,options:this.options,fragment:G,values:Y}),K._update(Y),J&&J({kind:"template instantiated and updated",template:$,instance:K,parts:K._$parts,options:this.options,fragment:G,values:Y}),this._commitNode(G),this._$committedValue=K}}_$getTemplate(X){let Y=RX.get(X.strings);if(Y===void 0)RX.set(X.strings,Y=new u(X));return Y}_commitIterable(X){if(!zX(this._$committedValue))this._$committedValue=[],this._$clear();let Y=this._$committedValue,Z=0,$;for(let K of X){if(Z===Y.length)Y.push($=new p(this._insert(g()),this._insert(g()),this,this.options));else $=Y[Z];$._$setValue(K),Z++}if(Z<Y.length)this._$clear($&&I($._$endNode).nextSibling,Z),Y.length=Z}_$clear(X=I(this._$startNode).nextSibling,Y){this._$notifyConnectionChanged?.(!1,!0,Y);while(X!==this._$endNode){let Z=I(X).nextSibling;I(X).remove(),X=Z}}setConnected(X){if(this._$parent===void 0)this.__isConnected=X,this._$notifyConnectionChanged?.(X);else throw Error("part.setConnected() may only be called on a RootPart returned from render().")}}class i{get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor(X,Y,Z,$,K){if(this.type=BX,this._$committedValue=F,this._$disconnectableChildren=void 0,this.element=X,this.name=Y,this._$parent=$,this.options=K,Z.length>2||Z[0]!==""||Z[1]!=="")this._$committedValue=Array(Z.length-1).fill(new String),this.strings=Z;else this._$committedValue=F;this._sanitizer=void 0}_$setValue(X,Y=this,Z,$){let K=this.strings,G=!1;if(K===void 0){if(X=y(this,X,Y,0),G=!m(X)||X!==this._$committedValue&&X!==b,G)this._$committedValue=X}else{let H=X;X=K[0];let Q,B;for(Q=0;Q<K.length-1;Q++){if(B=y(this,H[Z+Q],Y,Q),B===b)B=this._$committedValue[Q];if(G||=!m(B)||B!==this._$committedValue[Q],B===F)X=F;else if(X!==F)X+=(B??"")+K[Q+1];this._$committedValue[Q]=B}}if(G&&!$)this._commitValue(X)}_commitValue(X){if(X===F)I(this.element).removeAttribute(this.name);else{if(this._sanitizer===void 0)this._sanitizer=P(this.element,this.name,"attribute");X=this._sanitizer(X??""),J&&J({kind:"commit attribute",element:this.element,name:this.name,value:X,options:this.options}),I(this.element).setAttribute(this.name,X??"")}}}class yX extends i{constructor(){super(...arguments);this.type=FY}_commitValue(X){if(this._sanitizer===void 0)this._sanitizer=P(this.element,this.name,"property");X=this._sanitizer(X),J&&J({kind:"commit property",element:this.element,name:this.name,value:X,options:this.options}),this.element[this.name]=X===F?void 0:X}}class EX extends i{constructor(){super(...arguments);this.type=qY}_commitValue(X){J&&J({kind:"commit boolean attribute",element:this.element,name:this.name,value:!!(X&&X!==F),options:this.options}),I(this.element).toggleAttribute(this.name,!!X&&X!==F)}}class xX extends i{constructor(X,Y,Z,$,K){super(X,Y,Z,$,K);if(this.type=WY,this.strings!==void 0)throw Error(`A \`<${X.localName}>\` has a \`@${Y}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`)}_$setValue(X,Y=this){if(X=y(this,X,Y,0)??F,X===b)return;let Z=this._$committedValue,$=X===F&&Z!==F||X.capture!==Z.capture||X.once!==Z.once||X.passive!==Z.passive,K=X!==F&&(Z===F||$);if(J&&J({kind:"commit event listener",element:this.element,name:this.name,value:X,options:this.options,removeListener:$,addListener:K,oldListener:Z}),$)this.element.removeEventListener(this.name,this,Z);if(K)this.element.addEventListener(this.name,this,X);this._$committedValue=X}handleEvent(X){if(typeof this._$committedValue==="function")this._$committedValue.call(this.options?.host??this.element,X);else this._$committedValue.handleEvent(X)}}class cX{constructor(X,Y,Z){this.element=X,this.type=FX,this._$disconnectableChildren=void 0,this._$parent=Y,this.options=Z}get _$isConnected(){return this._$parent._$isConnected}_$setValue(X){J&&J({kind:"commit to element binding",element:this.element,value:X,options:this.options}),y(this,X)}}var jY=f.litHtmlPolyfillSupportDevMode;jY?.(u,p);(f.litHtmlVersions??=[]).push("3.3.2");if(f.litHtmlVersions.length>1)queueMicrotask(()=>{v("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var d=(X,Y,Z)=>{if(Y==null)throw TypeError(`The container to render into may not be ${Y}`);let $=eX++,K=Z?.renderBefore??Y,G=K._$litPart$;if(J&&J({kind:"begin render",id:$,value:X,container:Y,options:Z,part:G}),G===void 0){let H=Z?.renderBefore??null;K._$litPart$=G=new p(Y.insertBefore(g(),H),H,void 0,Z??{})}return G._$setValue(X),J&&J({kind:"end render",id:$,value:X,container:Y,options:Z,part:G}),G};d.setSanitizer=YY,d.createSanitizer=JX,d._testOnlyClearSanitizerFactoryDoNotCallOrElse=ZY;var fY=(X,Y)=>X,WX=!0,T=globalThis,dX;if(WX)T.litIssuedWarnings??=new Set,dX=(X,Y)=>{if(Y+=` See https://lit.dev/msg/${X} for more information.`,!T.litIssuedWarnings.has(Y)&&!T.litIssuedWarnings.has(X))console.warn(Y),T.litIssuedWarnings.add(Y)};class S extends j{constructor(){super(...arguments);this.renderOptions={host:this},this.__childPart=void 0}createRenderRoot(){let X=super.createRenderRoot();return this.renderOptions.renderBefore??=X.firstChild,X}update(X){let Y=this.render();if(!this.hasUpdated)this.renderOptions.isConnected=this.isConnected;super.update(X),this.__childPart=d(Y,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.__childPart?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.__childPart?.setConnected(!1)}render(){return b}}S._$litElement$=!0;S[fY("finalized",S)]=!0;T.litElementHydrateSupport?.({LitElement:S});var _Y=WX?T.litElementPolyfillSupportDevMode:T.litElementPolyfillSupport;_Y?.({LitElement:S});(T.litElementVersions??=[]).push("4.2.2");if(WX&&T.litElementVersions.length>1)queueMicrotask(()=>{dX("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var vX=(X)=>(Y,Z)=>{if(Z!==void 0)Z.addInitializer(()=>{customElements.define(X,Y)});else customElements.define(X,Y)};var gX=!0,mX;if(gX)globalThis.litIssuedWarnings??=new Set,mX=(X,Y)=>{if(Y+=` See https://lit.dev/msg/${X} for more information.`,!globalThis.litIssuedWarnings.has(Y)&&!globalThis.litIssuedWarnings.has(X))console.warn(Y),globalThis.litIssuedWarnings.add(Y)};var AY=(X,Y,Z)=>{let $=Y.hasOwnProperty(Z);return Y.constructor.createProperty(Z,X),$?Object.getOwnPropertyDescriptor(Y,Z):void 0},MY={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:s},IY=(X=MY,Y,Z)=>{let{kind:$,metadata:K}=Z;if(gX&&K==null)mX("missing-class-metadata",`The class ${Y} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);let G=globalThis.litPropertyMetadata.get(K);if(G===void 0)globalThis.litPropertyMetadata.set(K,G=new Map);if($==="setter")X=Object.create(X),X.wrapped=!0;if(G.set(Z.name,X),$==="accessor"){let{name:H}=Z;return{set(Q){let B=Y.get.call(this);Y.set.call(this,Q),this.requestUpdate(H,B,X,!0,Q)},init(Q){if(Q!==void 0)this._$changeProperty(H,void 0,X,Q);return Q}}}else if($==="setter"){let{name:H}=Z;return function(Q){let B=this[H];Y.call(this,Q),this.requestUpdate(H,B,X,!0,Q)}}throw Error(`Unsupported decorator location: ${$}`)};function w(X){return(Y,Z)=>{return typeof Z==="object"?IY(X,Y,Z):AY(X,Y,Z)}}function E(X){return w({...X,state:!0,attribute:!1})}var NY=!0,VY;if(NY)globalThis.litIssuedWarnings??=new Set,VY=(X,Y)=>{if(Y+=X?` See https://lit.dev/msg/${X} for more information.`:"",!globalThis.litIssuedWarnings.has(Y)&&!globalThis.litIssuedWarnings.has(X))console.warn(Y),globalThis.litIssuedWarnings.add(Y)};function TY(X){let Y=X.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return Y=Y.replace(/```(\w*)\n([\s\S]*?)```/g,"<pre><code>$2</code></pre>"),Y=Y.replace(/`([^`]+)`/g,"<code>$1</code>"),Y=Y.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),Y=Y.replace(/\*([^*]+)\*/g,"<em>$1</em>"),Y=Y.replace(/^### (.+)$/gm,"<h4>$1</h4>"),Y=Y.replace(/^## (.+)$/gm,"<h3>$1</h3>"),Y=Y.replace(/^# (.+)$/gm,"<h2>$1</h2>"),Y=Y.replace(/^- (.+)$/gm,"<li>$1</li>"),Y=Y.replace(/(<li>.*<\/li>\n?)+/g,"<ul>$&</ul>"),Y=Y.replace(/\n/g,"<br>"),Y}class UX extends S{constructor(){super(...arguments);this.projectId=0;this.mockId=0;this.sessionId="";this.mockName="";this.messages=[];this.inputText="";this.isProcessing=!1;this.isConnected=!1;this.thinkingContent=""}eventSource=null;lastSequence=0;autoScroll=!0;reconnectAttempts=0;maxReconnectAttempts=5;connectedCallback(){if(super.connectedCallback(),this.sessionId)this.loadHistory(),this.connectSSE()}disconnectedCallback(){super.disconnectedCallback(),this.closeSSE()}async loadHistory(){try{let X=await fetch(`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/messages?after=${this.lastSequence}`);if(X.ok){let Y=await X.json();if(Array.isArray(Y))for(let Z of Y)this.addOrUpdateMessage(Z)}}catch(X){console.error("[smock-ai-chat] Failed to load history:",X)}}connectSSE(){if(!this.sessionId)return;this.closeSSE();let X=`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/stream`;this.eventSource=new EventSource(X),this.isConnected=!0,this.reconnectAttempts=0,this.eventSource.addEventListener("status",(Y)=>{try{let Z=JSON.parse(Y.data);if(Z.processing!==void 0){if(this.isProcessing=Z.processing,!Z.processing&&this.thinkingContent)this.thinkingContent=""}}catch(Z){}}),this.eventSource.addEventListener("message",(Y)=>{try{let Z=JSON.parse(Y.data);this.handleStreamMessage(Z)}catch(Z){}}),this.eventSource.addEventListener("closed",()=>{this.isConnected=!1,this.closeSSE()}),this.eventSource.onerror=()=>{if(this.isConnected=!1,this.reconnectAttempts<this.maxReconnectAttempts)this.reconnectAttempts++,setTimeout(()=>{this.loadHistory(),this.connectSSE()},3000)}}closeSSE(){if(this.eventSource)this.eventSource.close(),this.eventSource=null}handleStreamMessage(X){let{contentType:Y,content:Z,toolName:$,sequence:K}=X;if(K)this.lastSequence=Math.max(this.lastSequence,K);switch(Y){case"thinking":this.thinkingContent+=Z||"",this.addOrUpdateThinking();break;case"text":{if(this.thinkingContent)this.thinkingContent="";let G=this.messages[this.messages.length-1];if(G&&G.role==="assistant"&&G.contentType==="text")G.content+=Z||"",this.messages=[...this.messages];else this.messages=[...this.messages,{role:"assistant",content:Z||"",contentType:"text",toolName:"",sequence:K||0}];break}case"tool_use":this.messages=[...this.messages,{role:"assistant",content:Z||"",contentType:"tool_use",toolName:$||"",sequence:K||0}];break;case"tool_result":this.messages=[...this.messages,{role:"assistant",content:Z||"",contentType:"tool_result",toolName:"",sequence:K||0}],this.checkMockUpdated(Z||"");break;case"error":this.messages=[...this.messages,{role:"assistant",content:Z||"",contentType:"error",toolName:"",sequence:K||0}];break}this.scrollToBottomIfNeeded()}addOrUpdateThinking(){let X=this.messages[this.messages.length-1];if(X&&X.contentType==="thinking")X.content=this.thinkingContent,this.messages=[...this.messages];else this.messages=[...this.messages,{role:"assistant",content:this.thinkingContent,contentType:"thinking",toolName:"",sequence:0}];this.scrollToBottomIfNeeded()}addOrUpdateMessage(X){if(X.sequence&&X.sequence<=this.lastSequence)return;if(X.sequence)this.lastSequence=X.sequence;this.messages=[...this.messages,{role:X.role||"assistant",content:X.content||"",contentType:X.contentType||"text",toolName:X.toolName||"",sequence:X.sequence||0}]}checkMockUpdated(X){if(X.includes("slug")||X.includes("file_count")||X.includes("upload"))try{let Y=JSON.parse(X);if(Y.slug){if(this.dispatchEvent(new CustomEvent("mock-updated",{detail:{mockId:Y.id||this.mockId,slug:Y.slug,entryFile:Y.entry_file},bubbles:!0,composed:!0})),!this.mockId&&Y.id)this.mockId=Y.id}}catch(Y){}}async sendMessage(){let X=this.inputText.trim();if(!X||this.isProcessing)return;this.messages=[...this.messages,{role:"user",content:X,contentType:"text",toolName:"",sequence:0}],this.inputText="",this.isProcessing=!0,this.scrollToBottomIfNeeded();let Y=this.shadowRoot?.querySelector(".chat-textarea");if(Y)Y.style.height="";try{if(!this.sessionId){let $=document.getElementById("mock-name-input")?.value?.trim()||this.mockName||"Untitled",K=await fetch(`/api/projects/${this.projectId}/ai/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:$,mockId:this.mockId||null})});if(!K.ok)throw Error("Failed to create session");let G=await K.json();if(this.sessionId=G.sessionId,G.mockId)this.mockId=G.mockId;this.connectSSE()}await fetch(`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:X})})}catch(Z){console.error("[smock-ai-chat] Send failed:",Z),this.messages=[...this.messages,{role:"assistant",content:"Błąd wysyłania wiadomości",contentType:"error",toolName:"",sequence:0}],this.isProcessing=!1}}async stopProcessing(){if(!this.sessionId)return;try{await fetch(`/api/projects/${this.projectId}/ai/sessions/${this.sessionId}/stop`,{method:"POST",headers:{"Content-Type":"application/json"}})}catch(X){console.error("[smock-ai-chat] Stop failed:",X)}}handleScroll(X){let Y=X.target,Z=Y.scrollHeight-Y.scrollTop-Y.clientHeight;if(Z>100)this.autoScroll=!1;else if(Z<50)this.autoScroll=!0}scrollToBottomIfNeeded(){if(!this.autoScroll)return;requestAnimationFrame(()=>{let X=this.shadowRoot?.querySelector(".chat-messages");if(X)X.scrollTop=X.scrollHeight})}updated(){this.scrollToBottomIfNeeded()}static styles=jX`
    :host {
      display: flex;
      flex-direction: column;
      width: 420px;
      flex-shrink: 0;
      border-left: 1px solid var(--border, #e5e7eb);
      background: var(--bg, #fafafa);
      height: 100%;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .chat-header {
      padding: 12px 16px;
      background: #f3f4f6;
      border-bottom: 1px solid var(--border, #e5e7eb);
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      gap: 12px;
      display: flex;
      flex-direction: column;
      scroll-behavior: smooth;
    }

    .msg {
      max-width: 80%;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .msg-user {
      align-self: flex-end;
      background: var(--accent, #2563eb);
      color: #fff;
      border-radius: 12px 12px 0 12px;
      white-space: pre-wrap;
    }

    .msg-text {
      align-self: flex-start;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 12px 12px 12px 0;
    }
    .msg-text pre {
      background: #f3f4f6;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.8rem;
    }
    .msg-text code {
      background: #f3f4f6;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.85em;
    }
    .msg-text pre code {
      background: none;
      padding: 0;
    }

    .msg-thinking {
      align-self: flex-start;
      max-width: 90%;
    }
    .msg-thinking summary {
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--muted, #6b7280);
      font-style: italic;
      padding: 6px 10px;
      background: #f3f0ff;
      border-radius: 8px;
    }
    .msg-thinking .thinking-content {
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--muted, #6b7280);
      padding: 8px 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    .thinking-pulse {
      animation: pulse 1.5s infinite;
    }

    .msg-tool-use, .msg-tool-result {
      align-self: flex-start;
      max-width: 90%;
      background: #f5f5f5;
      font-size: 0.8rem;
      border-radius: 6px;
      padding: 0;
    }
    .msg-tool-use summary, .msg-tool-result summary {
      cursor: pointer;
      padding: 6px 10px;
      font-size: 0.8rem;
    }
    .tool-content {
      padding: 8px 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 0.75rem;
    }

    .msg-error {
      align-self: flex-start;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      border-radius: 8px;
    }

    .processing-indicator {
      display: flex;
      gap: 4px;
      padding: 8px 16px;
      align-self: flex-start;
    }
    @keyframes dot-pulse {
      0%, 100% { transform: scale(0.4); opacity: 0.4; }
      50% { transform: scale(1); opacity: 1; }
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--muted, #6b7280);
    }
    .dot:nth-child(1) { animation: dot-pulse 1.2s 0s infinite; }
    .dot:nth-child(2) { animation: dot-pulse 1.2s 0.2s infinite; }
    .dot:nth-child(3) { animation: dot-pulse 1.2s 0.4s infinite; }

    .chat-input-area {
      flex-shrink: 0;
      border-top: 1px solid var(--border, #e5e7eb);
      padding: 12px;
      background: var(--bg, #fafafa);
      position: relative;
    }

    .input-wrapper {
      position: relative;
    }

    .chat-textarea {
      width: 100%;
      min-height: 44px;
      max-height: 200px;
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 12px;
      padding: 10px 44px 10px 12px;
      font-size: 0.9rem;
      font-family: inherit;
      resize: none;
      outline: none;
      box-sizing: border-box;
    }
    .chat-textarea:focus {
      border-color: var(--accent, #2563eb);
    }
    .chat-textarea::placeholder {
      color: var(--muted, #6b7280);
    }

    .btn-send, .btn-stop {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-send {
      background: var(--accent, #2563eb);
      color: #fff;
    }
    .btn-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-send svg, .btn-stop svg {
      width: 16px;
      height: 16px;
    }
    .btn-stop {
      background: var(--danger, #dc2626);
      color: #fff;
    }

    .reconnecting {
      padding: 4px 16px;
      font-size: 0.75rem;
      color: var(--warning, #d97706);
      text-align: center;
    }

    .welcome {
      padding: 24px 16px;
      text-align: center;
      color: var(--muted, #6b7280);
      font-size: 0.9rem;
    }
  `;render(){let X=this.messages.length>0;return _`
      <div class="chat-header">
        <span>\u{1F916}</span> AI Chat
      </div>

      <div class="chat-messages" @scroll=${this.handleScroll}>
        ${!X&&!this.sessionId?_`
          <div class="welcome">
            Opisz mockup, kt\u00F3ry chcesz stworzy\u0107. AI wygeneruje pliki HTML/CSS/JS.
          </div>
        `:F}

        ${this.messages.map((Y)=>this.renderMessage(Y))}

        ${this.isProcessing&&!this.isActiveStreaming()?_`
          <div class="processing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        `:F}
      </div>

      ${!this.isConnected&&this.sessionId&&this.reconnectAttempts>0?_`
        <div class="reconnecting">Reconnecting...</div>
      `:F}

      <div class="chat-input-area">
        <div class="input-wrapper">
          <textarea
            class="chat-textarea"
            placeholder="Opisz co chcesz zmieni\u0107..."
            .value=${this.inputText}
            @input=${this.handleInput}
            @keydown=${this.handleKeydown}
          ></textarea>
          ${this.isProcessing?_`
            <button class="btn-stop" @click=${this.stopProcessing} title="Stop">
              <svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10" rx="1"/></svg>
            </button>
          `:_`
            <button
              class="btn-send"
              @click=${this.sendMessage}
              ?disabled=${!this.inputText.trim()}
              title="Wy\u015Blij (Ctrl+Enter)"
            >
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2L8 14M8 2L3 7M8 2L13 7"/><path d="M8 2L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 7L8 2L13 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </button>
          `}
        </div>
      </div>
    `}renderMessage(X){switch(X.contentType){case"text":if(X.role==="user")return _`<div class="msg msg-user">${X.content}</div>`;return _`<div class="msg msg-text" .innerHTML=${TY(X.content)}></div>`;case"thinking":{let Y=this.isProcessing&&this.messages[this.messages.length-1]===X;return _`
          <details class="msg-thinking" ?open=${Y}>
            <summary class=${Y?"thinking-pulse":""}>My\u015Blenie...</summary>
            <div class="thinking-content">${X.content}</div>
          </details>
        `}case"tool_use":return _`
          <details class="msg-tool-use">
            <summary>\u{1F527} ${X.toolName||"Tool"}</summary>
            <div class="tool-content">${X.content.substring(0,2000)}</div>
          </details>
        `;case"tool_result":return _`
          <details class="msg-tool-result">
            <summary>\u2713 Result</summary>
            <div class="tool-content">${X.content.substring(0,2000)}</div>
          </details>
        `;case"error":return _`<div class="msg msg-error">${X.content}</div>`;default:return F}}isActiveStreaming(){if(this.messages.length===0)return!1;let X=this.messages[this.messages.length-1];return X.role==="assistant"&&(X.contentType==="text"||X.contentType==="thinking")}handleInput(X){let Y=X.target;this.inputText=Y.value,Y.style.height="",Y.style.height=Math.min(Y.scrollHeight,200)+"px"}handleKeydown(X){if(X.ctrlKey&&X.key==="Enter")X.preventDefault(),this.sendMessage()}}A([w({type:Number,attribute:"project-id"})],UX.prototype,"projectId",void 0),A([w({type:Number,attribute:"mock-id"})],UX.prototype,"mockId",void 0),A([w({type:String,attribute:"session-id"})],UX.prototype,"sessionId",void 0),A([w({type:String,attribute:"mock-name"})],UX.prototype,"mockName",void 0),A([E()],UX.prototype,"messages",void 0),A([E()],UX.prototype,"inputText",void 0),A([E()],UX.prototype,"isProcessing",void 0),A([E()],UX.prototype,"isConnected",void 0),A([E()],UX.prototype,"thinkingContent",void 0),UX=A([vX("smock-ai-chat")],UX);export{UX as SmockAiChat};
