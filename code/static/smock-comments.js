var k=function(Z,$,K,X){var Y=arguments.length,G=Y<3?$:X===null?X=Object.getOwnPropertyDescriptor($,K):X,Q;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")G=Reflect.decorate(Z,$,K,X);else for(var J=Z.length-1;J>=0;J--)if(Q=Z[J])G=(Y<3?Q(G):Y>3?Q($,K,G):Q($,K))||G;return Y>3&&G&&Object.defineProperty($,K,G),G};var s=globalThis,$Z=s.ShadowRoot&&(s.ShadyCSS===void 0||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,KZ=Symbol(),_Z=new WeakMap;class XZ{constructor(Z,$,K){if(this._$cssResult$=!0,K!==KZ)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=Z,this._strings=$}get styleSheet(){let Z=this._styleSheet,$=this._strings;if($Z&&Z===void 0){let K=$!==void 0&&$.length===1;if(K)Z=_Z.get($);if(Z===void 0){if((this._styleSheet=Z=new CSSStyleSheet).replaceSync(this.cssText),K)_Z.set($,Z)}}return Z}toString(){return this.cssText}}var lZ=(Z)=>{if(Z._$cssResult$===!0)return Z.cssText;else if(typeof Z==="number")return Z;else throw Error(`Value passed to 'css' function must be a 'css' function result: ${Z}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)},iZ=(Z)=>new XZ(typeof Z==="string"?Z:String(Z),void 0,KZ),AZ=(Z,...$)=>{let K=Z.length===1?Z[0]:$.reduce((X,Y,G)=>X+lZ(Y)+Z[G+1],Z[0]);return new XZ(K,Z,KZ)},MZ=(Z,$)=>{if($Z)Z.adoptedStyleSheets=$.map((K)=>K instanceof CSSStyleSheet?K:K.styleSheet);else for(let K of $){let X=document.createElement("style"),Y=s.litNonce;if(Y!==void 0)X.setAttribute("nonce",Y);X.textContent=K.cssText,Z.appendChild(X)}},sZ=(Z)=>{let $="";for(let K of Z.cssRules)$+=K.cssText;return iZ($)},YZ=$Z?(Z)=>Z:(Z)=>Z instanceof CSSStyleSheet?sZ(Z):Z;var{is:oZ,defineProperty:rZ,getOwnPropertyDescriptor:NZ,getOwnPropertyNames:nZ,getOwnPropertySymbols:aZ,getPrototypeOf:VZ}=Object,tZ=!1,j=globalThis;if(tZ)j.customElements??=customElements;var _=!0,I,IZ=j.trustedTypes,eZ=IZ?IZ.emptyScript:"",DZ=_?j.reactiveElementPolyfillSupportDevMode:j.reactiveElementPolyfillSupport;if(_)j.litIssuedWarnings??=new Set,I=(Z,$)=>{if($+=` See https://lit.dev/msg/${Z} for more information.`,!j.litIssuedWarnings.has($)&&!j.litIssuedWarnings.has(Z))console.warn($),j.litIssuedWarnings.add($)},queueMicrotask(()=>{if(I("dev-mode","Lit is in dev mode. Not recommended for production!"),j.ShadyDOM?.inUse&&DZ===void 0)I("polyfill-support-missing","Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.")});var Z0=_?(Z)=>{if(!j.emitLitDebugLogEvents)return;j.dispatchEvent(new CustomEvent("lit-debug",{detail:Z}))}:void 0,y=(Z,$)=>Z,b={toAttribute(Z,$){switch($){case Boolean:Z=Z?eZ:null;break;case Object:case Array:Z=Z==null?Z:JSON.stringify(Z);break}return Z},fromAttribute(Z,$){let K=Z;switch($){case Boolean:K=Z!==null;break;case Number:K=Z===null?null:Number(Z);break;case Object:case Array:try{K=JSON.parse(Z)}catch(X){K=null}break}return K}},o=(Z,$)=>!oZ(Z,$),LZ={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:o};Symbol.metadata??=Symbol("metadata");j.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(Z){this.__prepare(),(this._initializers??=[]).push(Z)}static get observedAttributes(){return this.finalize(),this.__attributeToPropertyMap&&[...this.__attributeToPropertyMap.keys()]}static createProperty(Z,$=LZ){if($.state)$.attribute=!1;if(this.__prepare(),this.prototype.hasOwnProperty(Z))$=Object.create($),$.wrapped=!0;if(this.elementProperties.set(Z,$),!$.noAccessor){let K=_?Symbol.for(`${String(Z)} (@property() cache)`):Symbol(),X=this.getPropertyDescriptor(Z,K,$);if(X!==void 0)rZ(this.prototype,Z,X)}}static getPropertyDescriptor(Z,$,K){let{get:X,set:Y}=NZ(this.prototype,Z)??{get(){return this[$]},set(G){this[$]=G}};if(_&&X==null){if("value"in(NZ(this.prototype,Z)??{}))throw Error(`Field ${JSON.stringify(String(Z))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);I("reactive-property-without-getter",`Field ${JSON.stringify(String(Z))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`)}return{get:X,set(G){let Q=X?.call(this);Y?.call(this,G),this.requestUpdate(Z,Q,K)},configurable:!0,enumerable:!0}}static getPropertyOptions(Z){return this.elementProperties.get(Z)??LZ}static __prepare(){if(this.hasOwnProperty(y("elementProperties",this)))return;let Z=VZ(this);if(Z.finalize(),Z._initializers!==void 0)this._initializers=[...Z._initializers];this.elementProperties=new Map(Z.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized",this)))return;if(this.finalized=!0,this.__prepare(),this.hasOwnProperty(y("properties",this))){let $=this.properties,K=[...nZ($),...aZ($)];for(let X of K)this.createProperty(X,$[X])}let Z=this[Symbol.metadata];if(Z!==null){let $=litPropertyMetadata.get(Z);if($!==void 0)for(let[K,X]of $)this.elementProperties.set(K,X)}this.__attributeToPropertyMap=new Map;for(let[$,K]of this.elementProperties){let X=this.__attributeNameForProperty($,K);if(X!==void 0)this.__attributeToPropertyMap.set(X,$)}if(this.elementStyles=this.finalizeStyles(this.styles),_){if(this.hasOwnProperty("createProperty"))I("no-override-create-property","Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");if(this.hasOwnProperty("getPropertyDescriptor"))I("no-override-get-property-descriptor","Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators")}}static finalizeStyles(Z){let $=[];if(Array.isArray(Z)){let K=new Set(Z.flat(1/0).reverse());for(let X of K)$.unshift(YZ(X))}else if(Z!==void 0)$.push(YZ(Z));return $}static __attributeNameForProperty(Z,$){let K=$.attribute;return K===!1?void 0:typeof K==="string"?K:typeof Z==="string"?Z.toLowerCase():void 0}constructor(){super();this.__instanceProperties=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.__reflectingProperty=null,this.__initialize()}__initialize(){this.__updatePromise=new Promise((Z)=>this.enableUpdating=Z),this._$changedProperties=new Map,this.__saveInstanceProperties(),this.requestUpdate(),this.constructor._initializers?.forEach((Z)=>Z(this))}addController(Z){if((this.__controllers??=new Set).add(Z),this.renderRoot!==void 0&&this.isConnected)Z.hostConnected?.()}removeController(Z){this.__controllers?.delete(Z)}__saveInstanceProperties(){let Z=new Map,$=this.constructor.elementProperties;for(let K of $.keys())if(this.hasOwnProperty(K))Z.set(K,this[K]),delete this[K];if(Z.size>0)this.__instanceProperties=Z}createRenderRoot(){let Z=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return MZ(Z,this.constructor.elementStyles),Z}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.__controllers?.forEach((Z)=>Z.hostConnected?.())}enableUpdating(Z){}disconnectedCallback(){this.__controllers?.forEach((Z)=>Z.hostDisconnected?.())}attributeChangedCallback(Z,$,K){this._$attributeToProperty(Z,K)}__propertyToAttribute(Z,$){let X=this.constructor.elementProperties.get(Z),Y=this.constructor.__attributeNameForProperty(Z,X);if(Y!==void 0&&X.reflect===!0){let Q=(X.converter?.toAttribute!==void 0?X.converter:b).toAttribute($,X.type);if(_&&this.constructor.enabledWarnings.includes("migration")&&Q===void 0)I("undefined-attribute-value",`The attribute value for the ${Z} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);if(this.__reflectingProperty=Z,Q==null)this.removeAttribute(Y);else this.setAttribute(Y,Q);this.__reflectingProperty=null}}_$attributeToProperty(Z,$){let K=this.constructor,X=K.__attributeToPropertyMap.get(Z);if(X!==void 0&&this.__reflectingProperty!==X){let Y=K.getPropertyOptions(X),G=typeof Y.converter==="function"?{fromAttribute:Y.converter}:Y.converter?.fromAttribute!==void 0?Y.converter:b;this.__reflectingProperty=X;let Q=G.fromAttribute($,Y.type);this[X]=Q??this.__defaultValues?.get(X)??Q,this.__reflectingProperty=null}}requestUpdate(Z,$,K,X=!1,Y){if(Z!==void 0){if(_&&Z instanceof Event)I("","The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()");let G=this.constructor;if(X===!1)Y=this[Z];if(K??=G.getPropertyOptions(Z),(K.hasChanged??o)(Y,$)||K.useDefault&&K.reflect&&Y===this.__defaultValues?.get(Z)&&!this.hasAttribute(G.__attributeNameForProperty(Z,K)))this._$changeProperty(Z,$,K);else return}if(this.isUpdatePending===!1)this.__updatePromise=this.__enqueueUpdate()}_$changeProperty(Z,$,{useDefault:K,reflect:X,wrapped:Y},G){if(K&&!(this.__defaultValues??=new Map).has(Z)){if(this.__defaultValues.set(Z,G??$??this[Z]),Y!==!0||G!==void 0)return}if(!this._$changedProperties.has(Z)){if(!this.hasUpdated&&!K)$=void 0;this._$changedProperties.set(Z,$)}if(X===!0&&this.__reflectingProperty!==Z)(this.__reflectingProperties??=new Set).add(Z)}async __enqueueUpdate(){this.isUpdatePending=!0;try{await this.__updatePromise}catch($){Promise.reject($)}let Z=this.scheduleUpdate();if(Z!=null)await Z;return!this.isUpdatePending}scheduleUpdate(){let Z=this.performUpdate();if(_&&this.constructor.enabledWarnings.includes("async-perform-update")&&typeof Z?.then==="function")I("async-perform-update",`Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);return Z}performUpdate(){if(!this.isUpdatePending)return;if(Z0?.({kind:"update"}),!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),_){let Y=[...this.constructor.elementProperties.keys()].filter((G)=>this.hasOwnProperty(G)&&(G in VZ(this)));if(Y.length)throw Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${Y.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`)}if(this.__instanceProperties){for(let[X,Y]of this.__instanceProperties)this[X]=Y;this.__instanceProperties=void 0}let K=this.constructor.elementProperties;if(K.size>0)for(let[X,Y]of K){let{wrapped:G}=Y,Q=this[X];if(G===!0&&!this._$changedProperties.has(X)&&Q!==void 0)this._$changeProperty(X,void 0,Y,Q)}}let Z=!1,$=this._$changedProperties;try{if(Z=this.shouldUpdate($),Z)this.willUpdate($),this.__controllers?.forEach((K)=>K.hostUpdate?.()),this.update($);else this.__markUpdated()}catch(K){throw Z=!1,this.__markUpdated(),K}if(Z)this._$didUpdate($)}willUpdate(Z){}_$didUpdate(Z){if(this.__controllers?.forEach(($)=>$.hostUpdated?.()),!this.hasUpdated)this.hasUpdated=!0,this.firstUpdated(Z);if(this.updated(Z),_&&this.isUpdatePending&&this.constructor.enabledWarnings.includes("change-in-update"))I("change-in-update",`Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`)}__markUpdated(){this._$changedProperties=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.__updatePromise}shouldUpdate(Z){return!0}update(Z){this.__reflectingProperties&&=this.__reflectingProperties.forEach(($)=>this.__propertyToAttribute($,this[$])),this.__markUpdated()}updated(Z){}firstUpdated(Z){}}A.elementStyles=[];A.shadowRootOptions={mode:"open"};A[y("elementProperties",A)]=new Map;A[y("finalized",A)]=new Map;DZ?.({ReactiveElement:A});if(_){A.enabledWarnings=["change-in-update","async-perform-update"];let Z=function($){if(!$.hasOwnProperty(y("enabledWarnings",$)))$.enabledWarnings=$.enabledWarnings.slice()};A.enableWarning=function($){if(Z(this),!this.enabledWarnings.includes($))this.enabledWarnings.push($)},A.disableWarning=function($){Z(this);let K=this.enabledWarnings.indexOf($);if(K>=0)this.enabledWarnings.splice(K,1)}}(j.reactiveElementVersions??=[]).push("2.1.2");if(_&&j.reactiveElementVersions.length>1)queueMicrotask(()=>{I("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var M=globalThis,q=(Z)=>{if(!M.emitLitDebugLogEvents)return;M.dispatchEvent(new CustomEvent("lit-debug",{detail:Z}))},$0=0,v;M.litIssuedWarnings??=new Set,v=(Z,$)=>{if($+=Z?` See https://lit.dev/msg/${Z} for more information.`:"",!M.litIssuedWarnings.has($)&&!M.litIssuedWarnings.has(Z))console.warn($),M.litIssuedWarnings.add($)},queueMicrotask(()=>{v("dev-mode","Lit is in dev mode. Not recommended for production!")});var L=M.ShadyDOM?.inUse&&M.ShadyDOM?.noPatch===!0?M.ShadyDOM.wrap:(Z)=>Z,r=M.trustedTypes,RZ=r?r.createPolicy("lit-html",{createHTML:(Z)=>Z}):void 0,K0=(Z)=>Z,e=(Z,$,K)=>K0,X0=(Z)=>{if(E!==e)throw Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");E=Z},Y0=()=>{E=e},qZ=(Z,$,K)=>{return E(Z,$,K)},wZ="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,EZ="?"+D,G0=`<${EZ}>`,P=document,g=()=>P.createComment(""),m=(Z)=>Z===null||typeof Z!="object"&&typeof Z!="function",zZ=Array.isArray,Q0=(Z)=>zZ(Z)||typeof Z?.[Symbol.iterator]==="function",GZ=`[ 	
\f\r]`,J0=`[^ 	
\f\r"'\`<>=]`,F0=`[^\\s"'>=/]`,h=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,TZ=1,QZ=2,q0=3,fZ=/-->/g,OZ=/>/g,f=new RegExp(`>|${GZ}(?:(${F0}+)(${GZ}*=${GZ}*(?:${J0}|("|')|))|$)`,"g"),z0=0,CZ=1,B0=2,SZ=3,JZ=/'/g,FZ=/"/g,yZ=/^(?:script|style|textarea|title)$/i,H0=1,n=2,a=3,BZ=1,t=2,W0=3,U0=4,k0=5,HZ=6,j0=7,WZ=(Z)=>($,...K)=>{if($.some((X)=>X===void 0))console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`);if(K.some((X)=>X?._$litStatic$))v("",`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);return{["_$litType$"]:Z,strings:$,values:K}},R=WZ(H0),P0=WZ(n),w0=WZ(a),w=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),PZ=new WeakMap,S=P.createTreeWalker(P,129),E=e;function xZ(Z,$){if(!zZ(Z)||!Z.hasOwnProperty("raw")){let K="invalid template strings array";throw K=`
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
`),Error(K)}return RZ!==void 0?RZ.createHTML($):$}var _0=(Z,$)=>{let K=Z.length-1,X=[],Y=$===n?"<svg>":$===a?"<math>":"",G,Q=h;for(let F=0;F<K;F++){let N=Z[F],z=-1,H,U=0,W;while(U<N.length){if(Q.lastIndex=U,W=Q.exec(N),W===null)break;if(U=Q.lastIndex,Q===h){if(W[TZ]==="!--")Q=fZ;else if(W[TZ]!==void 0)Q=OZ;else if(W[QZ]!==void 0){if(yZ.test(W[QZ]))G=new RegExp(`</${W[QZ]}`,"g");Q=f}else if(W[q0]!==void 0)throw Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions")}else if(Q===f)if(W[z0]===">")Q=G??h,z=-1;else if(W[CZ]===void 0)z=-2;else z=Q.lastIndex-W[B0].length,H=W[CZ],Q=W[SZ]===void 0?f:W[SZ]==='"'?FZ:JZ;else if(Q===FZ||Q===JZ)Q=f;else if(Q===fZ||Q===OZ)Q=h;else Q=f,G=void 0}console.assert(z===-1||Q===f||Q===JZ||Q===FZ,"unexpected parse state B");let C=Q===f&&Z[F+1].startsWith("/>")?" ":"";Y+=Q===h?N+G0:z>=0?(X.push(H),N.slice(0,z)+wZ+N.slice(z))+D+C:N+D+(z===-2?F:C)}let J=Y+(Z[K]||"<?>")+($===n?"</svg>":$===a?"</math>":"");return[xZ(Z,J),X]};class u{constructor({strings:Z,["_$litType$"]:$},K){this.parts=[];let X,Y=0,G=0,Q=Z.length-1,J=this.parts,[F,N]=_0(Z,$);if(this.el=u.createElement(F,K),S.currentNode=this.el.content,$===n||$===a){let z=this.el.content.firstChild;z.replaceWith(...z.childNodes)}while((X=S.nextNode())!==null&&J.length<Q){if(X.nodeType===1){{let z=X.localName;if(/^(?:textarea|template)$/i.test(z)&&X.innerHTML.includes(D)){let H=`Expressions are not supported inside \`${z}\` elements. See https://lit.dev/msg/expression-in-${z} for more information.`;if(z==="template")throw Error(H);else v("",H)}}if(X.hasAttributes()){for(let z of X.getAttributeNames())if(z.endsWith(wZ)){let H=N[G++],W=X.getAttribute(z).split(D),C=/([.?@])?(.*)/.exec(H);J.push({type:BZ,index:Y,name:C[2],strings:W,ctor:C[1]==="."?hZ:C[1]==="?"?cZ:C[1]==="@"?vZ:p}),X.removeAttribute(z)}else if(z.startsWith(D))J.push({type:HZ,index:Y}),X.removeAttribute(z)}if(yZ.test(X.tagName)){let z=X.textContent.split(D),H=z.length-1;if(H>0){X.textContent=r?r.emptyScript:"";for(let U=0;U<H;U++)X.append(z[U],g()),S.nextNode(),J.push({type:t,index:++Y});X.append(z[H],g())}}}else if(X.nodeType===8)if(X.data===EZ)J.push({type:t,index:Y});else{let H=-1;while((H=X.data.indexOf(D,H+1))!==-1)J.push({type:j0,index:Y}),H+=D.length-1}Y++}if(N.length!==G)throw Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`'+Z.join("${...}")+"`");q&&q({kind:"template prep",template:this,clonableTemplate:this.el,parts:this.parts,strings:Z})}static createElement(Z,$){let K=P.createElement("template");return K.innerHTML=Z,K}}function x(Z,$,K=Z,X){if($===w)return $;let Y=X!==void 0?K.__directives?.[X]:K.__directive,G=m($)?void 0:$._$litDirective$;if(Y?.constructor!==G){if(Y?._$notifyDirectiveConnectionChanged?.(!1),G===void 0)Y=void 0;else Y=new G(Z),Y._$initialize(Z,K,X);if(X!==void 0)(K.__directives??=[])[X]=Y;else K.__directive=Y}if(Y!==void 0)$=x(Z,Y._$resolve(Z,$.values),Y,X);return $}class bZ{constructor(Z,$){this._$parts=[],this._$disconnectableChildren=void 0,this._$template=Z,this._$parent=$}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone(Z){let{el:{content:$},parts:K}=this._$template,X=(Z?.creationScope??P).importNode($,!0);S.currentNode=X;let Y=S.nextNode(),G=0,Q=0,J=K[0];while(J!==void 0){if(G===J.index){let F;if(J.type===t)F=new d(Y,Y.nextSibling,this,Z);else if(J.type===BZ)F=new J.ctor(Y,J.name,J.strings,this,Z);else if(J.type===HZ)F=new gZ(Y,this,Z);this._$parts.push(F),J=K[++Q]}if(G!==J?.index)Y=S.nextNode(),G++}return S.currentNode=P,X}_update(Z){let $=0;for(let K of this._$parts){if(K!==void 0)if(q&&q({kind:"set part",part:K,value:Z[$],valueIndex:$,values:Z,templateInstance:this}),K.strings!==void 0)K._$setValue(Z,K,$),$+=K.strings.length-2;else K._$setValue(Z[$]);$++}}}class d{get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor(Z,$,K,X){this.type=t,this._$committedValue=B,this._$disconnectableChildren=void 0,this._$startNode=Z,this._$endNode=$,this._$parent=K,this.options=X,this.__isConnected=X?.isConnected??!0,this._textSanitizer=void 0}get parentNode(){let Z=L(this._$startNode).parentNode,$=this._$parent;if($!==void 0&&Z?.nodeType===11)Z=$.parentNode;return Z}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue(Z,$=this){if(this.parentNode===null)throw Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");if(Z=x(this,Z,$),m(Z)){if(Z===B||Z==null||Z===""){if(this._$committedValue!==B)q&&q({kind:"commit nothing to child",start:this._$startNode,end:this._$endNode,parent:this._$parent,options:this.options}),this._$clear();this._$committedValue=B}else if(Z!==this._$committedValue&&Z!==w)this._commitText(Z)}else if(Z._$litType$!==void 0)this._commitTemplateResult(Z);else if(Z.nodeType!==void 0){if(this.options?.host===Z){this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"),console.warn("Attempted to render the template host",Z,"inside itself. This is almost always a mistake, and in dev mode ","we render some warning text. In production however, we'll ","render it, which will usually result in an error, and sometimes ","in the element disappearing from the DOM.");return}this._commitNode(Z)}else if(Q0(Z))this._commitIterable(Z);else this._commitText(Z)}_insert(Z){return L(L(this._$startNode).parentNode).insertBefore(Z,this._$endNode)}_commitNode(Z){if(this._$committedValue!==Z){if(this._$clear(),E!==e){let $=this._$startNode.parentNode?.nodeName;if($==="STYLE"||$==="SCRIPT"){let K="Forbidden";if($==="STYLE")K="Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.";else K="Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.";throw Error(K)}}q&&q({kind:"commit node",start:this._$startNode,parent:this._$parent,value:Z,options:this.options}),this._$committedValue=this._insert(Z)}}_commitText(Z){if(this._$committedValue!==B&&m(this._$committedValue)){let $=L(this._$startNode).nextSibling;if(this._textSanitizer===void 0)this._textSanitizer=qZ($,"data","property");Z=this._textSanitizer(Z),q&&q({kind:"commit text",node:$,value:Z,options:this.options}),$.data=Z}else{let $=P.createTextNode("");if(this._commitNode($),this._textSanitizer===void 0)this._textSanitizer=qZ($,"data","property");Z=this._textSanitizer(Z),q&&q({kind:"commit text",node:$,value:Z,options:this.options}),$.data=Z}this._$committedValue=Z}_commitTemplateResult(Z){let{values:$,["_$litType$"]:K}=Z,X=typeof K==="number"?this._$getTemplate(Z):(K.el===void 0&&(K.el=u.createElement(xZ(K.h,K.h[0]),this.options)),K);if(this._$committedValue?._$template===X)q&&q({kind:"template updating",template:X,instance:this._$committedValue,parts:this._$committedValue._$parts,options:this.options,values:$}),this._$committedValue._update($);else{let Y=new bZ(X,this),G=Y._clone(this.options);q&&q({kind:"template instantiated",template:X,instance:Y,parts:Y._$parts,options:this.options,fragment:G,values:$}),Y._update($),q&&q({kind:"template instantiated and updated",template:X,instance:Y,parts:Y._$parts,options:this.options,fragment:G,values:$}),this._commitNode(G),this._$committedValue=Y}}_$getTemplate(Z){let $=PZ.get(Z.strings);if($===void 0)PZ.set(Z.strings,$=new u(Z));return $}_commitIterable(Z){if(!zZ(this._$committedValue))this._$committedValue=[],this._$clear();let $=this._$committedValue,K=0,X;for(let Y of Z){if(K===$.length)$.push(X=new d(this._insert(g()),this._insert(g()),this,this.options));else X=$[K];X._$setValue(Y),K++}if(K<$.length)this._$clear(X&&L(X._$endNode).nextSibling,K),$.length=K}_$clear(Z=L(this._$startNode).nextSibling,$){this._$notifyConnectionChanged?.(!1,!0,$);while(Z!==this._$endNode){let K=L(Z).nextSibling;L(Z).remove(),Z=K}}setConnected(Z){if(this._$parent===void 0)this.__isConnected=Z,this._$notifyConnectionChanged?.(Z);else throw Error("part.setConnected() may only be called on a RootPart returned from render().")}}class p{get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor(Z,$,K,X,Y){if(this.type=BZ,this._$committedValue=B,this._$disconnectableChildren=void 0,this.element=Z,this.name=$,this._$parent=X,this.options=Y,K.length>2||K[0]!==""||K[1]!=="")this._$committedValue=Array(K.length-1).fill(new String),this.strings=K;else this._$committedValue=B;this._sanitizer=void 0}_$setValue(Z,$=this,K,X){let Y=this.strings,G=!1;if(Y===void 0){if(Z=x(this,Z,$,0),G=!m(Z)||Z!==this._$committedValue&&Z!==w,G)this._$committedValue=Z}else{let Q=Z;Z=Y[0];let J,F;for(J=0;J<Y.length-1;J++){if(F=x(this,Q[K+J],$,J),F===w)F=this._$committedValue[J];if(G||=!m(F)||F!==this._$committedValue[J],F===B)Z=B;else if(Z!==B)Z+=(F??"")+Y[J+1];this._$committedValue[J]=F}}if(G&&!X)this._commitValue(Z)}_commitValue(Z){if(Z===B)L(this.element).removeAttribute(this.name);else{if(this._sanitizer===void 0)this._sanitizer=E(this.element,this.name,"attribute");Z=this._sanitizer(Z??""),q&&q({kind:"commit attribute",element:this.element,name:this.name,value:Z,options:this.options}),L(this.element).setAttribute(this.name,Z??"")}}}class hZ extends p{constructor(){super(...arguments);this.type=W0}_commitValue(Z){if(this._sanitizer===void 0)this._sanitizer=E(this.element,this.name,"property");Z=this._sanitizer(Z),q&&q({kind:"commit property",element:this.element,name:this.name,value:Z,options:this.options}),this.element[this.name]=Z===B?void 0:Z}}class cZ extends p{constructor(){super(...arguments);this.type=U0}_commitValue(Z){q&&q({kind:"commit boolean attribute",element:this.element,name:this.name,value:!!(Z&&Z!==B),options:this.options}),L(this.element).toggleAttribute(this.name,!!Z&&Z!==B)}}class vZ extends p{constructor(Z,$,K,X,Y){super(Z,$,K,X,Y);if(this.type=k0,this.strings!==void 0)throw Error(`A \`<${Z.localName}>\` has a \`@${$}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`)}_$setValue(Z,$=this){if(Z=x(this,Z,$,0)??B,Z===w)return;let K=this._$committedValue,X=Z===B&&K!==B||Z.capture!==K.capture||Z.once!==K.once||Z.passive!==K.passive,Y=Z!==B&&(K===B||X);if(q&&q({kind:"commit event listener",element:this.element,name:this.name,value:Z,options:this.options,removeListener:X,addListener:Y,oldListener:K}),X)this.element.removeEventListener(this.name,this,K);if(Y)this.element.addEventListener(this.name,this,Z);this._$committedValue=Z}handleEvent(Z){if(typeof this._$committedValue==="function")this._$committedValue.call(this.options?.host??this.element,Z);else this._$committedValue.handleEvent(Z)}}class gZ{constructor(Z,$,K){this.element=Z,this.type=HZ,this._$disconnectableChildren=void 0,this._$parent=$,this.options=K}get _$isConnected(){return this._$parent._$isConnected}_$setValue(Z){q&&q({kind:"commit to element binding",element:this.element,value:Z,options:this.options}),x(this,Z)}}var A0=M.litHtmlPolyfillSupportDevMode;A0?.(u,d);(M.litHtmlVersions??=[]).push("3.3.2");if(M.litHtmlVersions.length>1)queueMicrotask(()=>{v("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var c=(Z,$,K)=>{if($==null)throw TypeError(`The container to render into may not be ${$}`);let X=$0++,Y=K?.renderBefore??$,G=Y._$litPart$;if(q&&q({kind:"begin render",id:X,value:Z,container:$,options:K,part:G}),G===void 0){let Q=K?.renderBefore??null;Y._$litPart$=G=new d($.insertBefore(g(),Q),Q,void 0,K??{})}return G._$setValue(Z),q&&q({kind:"end render",id:X,value:Z,container:$,options:K,part:G}),G};c.setSanitizer=X0,c.createSanitizer=qZ,c._testOnlyClearSanitizerFactoryDoNotCallOrElse=Y0;var M0=(Z,$)=>Z,UZ=!0,T=globalThis,mZ;if(UZ)T.litIssuedWarnings??=new Set,mZ=(Z,$)=>{if($+=` See https://lit.dev/msg/${Z} for more information.`,!T.litIssuedWarnings.has($)&&!T.litIssuedWarnings.has(Z))console.warn($),T.litIssuedWarnings.add($)};class O extends A{constructor(){super(...arguments);this.renderOptions={host:this},this.__childPart=void 0}createRenderRoot(){let Z=super.createRenderRoot();return this.renderOptions.renderBefore??=Z.firstChild,Z}update(Z){let $=this.render();if(!this.hasUpdated)this.renderOptions.isConnected=this.isConnected;super.update(Z),this.__childPart=c($,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.__childPart?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.__childPart?.setConnected(!1)}render(){return w}}O._$litElement$=!0;O[M0("finalized",O)]=!0;T.litElementHydrateSupport?.({LitElement:O});var N0=UZ?T.litElementPolyfillSupportDevMode:T.litElementPolyfillSupport;N0?.({LitElement:O});(T.litElementVersions??=[]).push("4.2.2");if(UZ&&T.litElementVersions.length>1)queueMicrotask(()=>{mZ("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var uZ=(Z)=>($,K)=>{if(K!==void 0)K.addInitializer(()=>{customElements.define(Z,$)});else customElements.define(Z,$)};var dZ=!0,pZ;if(dZ)globalThis.litIssuedWarnings??=new Set,pZ=(Z,$)=>{if($+=` See https://lit.dev/msg/${Z} for more information.`,!globalThis.litIssuedWarnings.has($)&&!globalThis.litIssuedWarnings.has(Z))console.warn($),globalThis.litIssuedWarnings.add($)};var V0=(Z,$,K)=>{let X=$.hasOwnProperty(K);return $.constructor.createProperty(K,Z),X?Object.getOwnPropertyDescriptor($,K):void 0},I0={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:o},L0=(Z=I0,$,K)=>{let{kind:X,metadata:Y}=K;if(dZ&&Y==null)pZ("missing-class-metadata",`The class ${$} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);let G=globalThis.litPropertyMetadata.get(Y);if(G===void 0)globalThis.litPropertyMetadata.set(Y,G=new Map);if(X==="setter")Z=Object.create(Z),Z.wrapped=!0;if(G.set(K.name,Z),X==="accessor"){let{name:Q}=K;return{set(J){let F=$.get.call(this);$.set.call(this,J),this.requestUpdate(Q,F,Z,!0,J)},init(J){if(J!==void 0)this._$changeProperty(Q,void 0,Z,J);return J}}}else if(X==="setter"){let{name:Q}=K;return function(J){let F=this[Q];$.call(this,J),this.requestUpdate(Q,F,Z,!0,J)}}throw Error(`Unsupported decorator location: ${X}`)};function l(Z){return($,K)=>{return typeof K==="object"?L0(Z,$,K):V0(Z,$,K)}}function V(Z){return l({...Z,state:!0,attribute:!1})}var D0=!0,R0;if(D0)globalThis.litIssuedWarnings??=new Set,R0=(Z,$)=>{if($+=Z?` See https://lit.dev/msg/${Z} for more information.`:"",!globalThis.litIssuedWarnings.has($)&&!globalThis.litIssuedWarnings.has(Z))console.warn($),globalThis.litIssuedWarnings.add($)};async function i(Z,$){let K=await fetch(`/api/comments/${Z}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify($)});if(!K.ok)throw Error(`API ${Z}: ${K.status}`);return K.json()}function kZ(Z){let $=new Date(Z),X=Date.now()-$.getTime(),Y=Math.floor(X/1000);if(Y<60)return"teraz";let G=Math.floor(Y/60);if(G<60)return`${G} min temu`;let Q=Math.floor(G/60);if(Q<24)return`${Q} godz. temu`;let J=Math.floor(Q/24);if(J<7)return`${J} dn. temu`;return $.toLocaleDateString("pl-PL",{day:"numeric",month:"short"})}class jZ extends O{constructor(){super(...arguments);this.mockId=0;this.entryFile="index.html";this.pagePath="";this.threads=[];this.authorName="";this.showAll=!1;this.hideResolved=!1;this.confirmDeleteId=null;this.activeCompose=null;this.openThreadId=null;this.namePromptMode=!1;this.submitting=!1;this.commentMode=!1}channel=null;iframe=null;overlay=null;panel=null;iframeWrapper=null;connectedCallback(){if(super.connectedCallback(),this.pagePath=this.entryFile,this.loadAuthorName(),this.loadThreads(),window.well)this.channel=window.well.channel(`comments:${this.mockId}`),this.channel.on("message",(Z)=>{this.handleBusEvent(Z)});requestAnimationFrame(()=>{this.attachExternalElements()})}disconnectedCallback(){if(super.disconnectedCallback(),this.channel)this.channel.leave(),this.channel=null;this.detachExternalListeners()}async loadThreads(){try{let Z=await i("list",{mock_id:this.mockId});this.threads=Z.threads,this.renderPins()}catch(Z){console.error("[smock-comments] Failed to load threads:",Z)}}handleBusEvent(Z){if(!Array.isArray(Z))return;let[$,K]=Z;if(!Array.isArray(K))return;switch($){case"ThreadCreated":case"CommentAdded":case"ThreadResolved":case"ThreadDeleted":{let[X]=K;if(X===this.mockId)this.loadThreads();break}}}loadAuthorName(){let Z=localStorage.getItem("smock_author");if(Z){try{let $=JSON.parse(Z);if(Date.now()-$.timestamp<86400000&&$.name){this.authorName=$.name,this.namePromptMode=!1;return}}catch($){}localStorage.removeItem("smock_author")}this.authorName="",this.namePromptMode=!0}saveAuthorName(Z){this.authorName=Z,this.namePromptMode=!1,localStorage.setItem("smock_author",JSON.stringify({name:Z,timestamp:Date.now()}))}changeName(){localStorage.removeItem("smock_author"),this.authorName="",this.namePromptMode=!0}_overlayClickHandler=null;_iframeLoadHandler=null;_scrollHandler=null;_resizeHandler=null;_keydownHandler=null;_pageSelectHandler=null;_homeHandler=null;attachExternalElements(){if(this.iframe=document.getElementById("mock-iframe"),this.overlay=document.getElementById("comment-overlay"),this.panel=this,this.iframeWrapper=document.getElementById("iframe-wrapper"),this.overlay)this._overlayClickHandler=(Y)=>this.handleOverlayClick(Y),this.overlay.addEventListener("click",this._overlayClickHandler);if(this.iframe)this._iframeLoadHandler=()=>{this.attachIframeScrollListener(),this.syncOverlay(),this.detectIframeNavigation()},this.iframe.addEventListener("load",this._iframeLoadHandler),this.attachIframeScrollListener(),this.syncOverlay();this._keydownHandler=(Y)=>{if(Y.key==="Escape")this.activeCompose=null,this.openThreadId=null},document.addEventListener("keydown",this._keydownHandler);let Z=document.getElementById("page-select");if(Z)this._pageSelectHandler=()=>{this.pagePath=Z.value,this.activeCompose=null,this.openThreadId=null,this.renderPins()},Z.addEventListener("change",this._pageSelectHandler);let $=document.getElementById("home-page-btn");if($)this._homeHandler=()=>{this.pagePath=this.entryFile,this.activeCompose=null,this.openThreadId=null;let Y=document.getElementById("page-select");if(Y)Y.value=this.entryFile;this.renderPins()},$.addEventListener("click",this._homeHandler);let K=document.getElementById("comment-toggle");if(K)K.addEventListener("click",()=>{let Y=this.style.display!=="none";if(this.style.display=Y?"none":"",this.overlay)this.overlay.style.display=Y?"none":"";if(K.classList.toggle("active",!Y),Y)this.activeCompose=null,this.openThreadId=null,this.setCommentMode(!1)});let X=document.getElementById("comment-mode-switch");if(X)X.querySelectorAll(".comment-mode-opt").forEach((Y)=>{Y.addEventListener("click",()=>{this.setCommentMode(Y.dataset.mode==="comment")})})}detachExternalListeners(){if(this.overlay&&this._overlayClickHandler)this.overlay.removeEventListener("click",this._overlayClickHandler);if(this.iframe&&this._iframeLoadHandler)this.iframe.removeEventListener("load",this._iframeLoadHandler);if(this._keydownHandler)document.removeEventListener("keydown",this._keydownHandler)}syncOverlay(){if(!this.iframe||!this.overlay)return;try{let Z=this.iframe.contentDocument;if(!Z||!Z.body)return;let $=Z.documentElement.scrollWidth,K=Z.documentElement.scrollHeight,X=Z.documentElement.scrollLeft||Z.body.scrollLeft,Y=Z.documentElement.scrollTop||Z.body.scrollTop;this.overlay.style.width=$+"px",this.overlay.style.height=K+"px",this.overlay.style.transform=`translate(${-X}px, ${-Y}px)`}catch(Z){this.overlay.style.width="",this.overlay.style.height="",this.overlay.style.transform=""}}attachIframeScrollListener(){try{let Z=this.iframe?.contentDocument;if(!Z)return;this._scrollHandler=()=>this.syncOverlay(),Z.addEventListener("scroll",this._scrollHandler),this._resizeHandler=()=>this.syncOverlay(),this.iframe?.contentWindow?.addEventListener("resize",this._resizeHandler),this.syncOverlay()}catch(Z){}}detectIframeNavigation(){try{let Z=this.iframe?.contentWindow?.location.pathname||"",K=document.getElementById("mock-viewer")?.dataset.baseUrl||"",X=new URL(K,window.location.origin).pathname;if(Z.startsWith(X)){let Y=Z.slice(X.length);if(Y&&Y!==this.pagePath){this.pagePath=Y;let G=document.getElementById("page-select");if(G)G.value=Y;this.activeCompose=null,this.openThreadId=null,this.renderPins()}}}catch(Z){}}setCommentMode(Z){if(this.commentMode=Z,this.overlay)this.overlay.classList.toggle("comment-mode",Z);let $=document.getElementById("comment-mode-switch");if($)$.querySelectorAll(".comment-mode-opt").forEach((K)=>{let X=K,Y=X.dataset.mode==="navigate";X.classList.toggle("active",Z?!Y:Y)});if(!Z)this.activeCompose=null,this.openThreadId=null,this.renderPins()}handleOverlayClick(Z){let $=Z.target;if($.classList.contains("comment-pin")||$.closest(".comment-bubble"))return;if(this.activeCompose){this.activeCompose=null,this.renderPins();return}let K=this.overlay.offsetWidth,X=this.overlay.offsetHeight,Y=this.overlay.getBoundingClientRect(),G=Z.clientX-Y.left,Q=Z.clientY-Y.top,J=G/K*100,F=Q/X*100;if(!this.authorName)this.namePromptMode=!0;this.activeCompose={x:J,y:F},this.openThreadId=null,this.renderPins()}handlePinClick(Z,$){$.stopPropagation(),this.openThreadId=Z,this.activeCompose=null,this.renderPins()}async createThread(Z){if(!this.activeCompose||!Z.trim()||this.submitting)return;this.submitting=!0,this.renderPins();try{let $=await i("create_thread",{mock_id:this.mockId,page_path:this.pagePath,x_pct:this.activeCompose.x,y_pct:this.activeCompose.y,author_name:this.authorName,body:Z.trim()});this.activeCompose=null,this.openThreadId=$.id,await this.loadThreads()}catch($){console.error("[smock-comments] create_thread failed:",$)}finally{this.submitting=!1}}async addComment(Z,$){if(!$.trim()||this.submitting)return;this.submitting=!0,this.renderPins();try{await i("add_comment",{thread_id:Z,author_name:this.authorName,body:$.trim()}),await this.loadThreads()}catch(K){console.error("[smock-comments] add_comment failed:",K)}finally{this.submitting=!1}}async resolveThread(Z){try{await i("resolve_thread",{id:Z}),await this.loadThreads()}catch($){console.error("[smock-comments] resolve_thread failed:",$)}}async deleteThread(Z){if(this.confirmDeleteId!==Z){this.confirmDeleteId=Z;return}try{await i("delete_thread",{id:Z}),this.confirmDeleteId=null,this.openThreadId=null,await this.loadThreads()}catch($){console.error("[smock-comments] delete_thread failed:",$)}}renderPins(){if(!this.overlay)return;this.overlay.querySelectorAll(".comment-pin, .comment-bubble, .pin-tooltip").forEach((X)=>X.remove());let Z=this.threads.filter((X)=>X.page_path===this.pagePath),$=Z.filter((X)=>!X.resolved),K=Z.filter((X)=>X.resolved);if($.forEach((X,Y)=>{let G=document.createElement("div");G.className="comment-pin",G.style.left=X.x_pct+"%",G.style.top=X.y_pct+"%",G.textContent=String(Y+1),G.dataset.threadId=String(X.id),G.addEventListener("mouseenter",()=>{G.classList.add("pin-highlight"),this.highlightThreadInPanel(X.id,!0),this.showPinTooltip(G,X)}),G.addEventListener("mouseleave",()=>{G.classList.remove("pin-highlight"),this.highlightThreadInPanel(X.id,!1),this.hidePinTooltip()}),G.addEventListener("click",(Q)=>this.handlePinClick(X.id,Q)),this.overlay.appendChild(G)}),!this.hideResolved)K.forEach((X)=>{let Y=document.createElement("div");Y.className="comment-pin comment-pin-resolved",Y.style.left=X.x_pct+"%",Y.style.top=X.y_pct+"%",Y.textContent="✓",Y.dataset.threadId=String(X.id),Y.addEventListener("mouseenter",()=>{this.showPinTooltip(Y,X)}),Y.addEventListener("mouseleave",()=>{this.hidePinTooltip()}),Y.addEventListener("click",(G)=>this.handlePinClick(X.id,G)),this.overlay.appendChild(Y)});if(this.activeCompose){let X=document.createElement("div");X.className="comment-pin comment-pin-preview",X.textContent="•",X.style.left=this.activeCompose.x+"%",X.style.top=this.activeCompose.y+"%",this.overlay.appendChild(X),this.renderBubble(this.activeCompose.x,this.activeCompose.y,null)}if(this.openThreadId){let X=this.threads.find((Y)=>Y.id===this.openThreadId);if(X&&X.page_path===this.pagePath)this.renderBubble(X.x_pct,X.y_pct,X)}}showPinTooltip(Z,$){this.hidePinTooltip();let K=$.comments[0];if(!K)return;let X=document.createElement("div");X.className="pin-tooltip";let Y=K.body.length>60?K.body.substring(0,57)+"...":K.body;X.innerHTML=`<strong>${this.esc(K.author_name)}</strong>: ${this.esc(Y)}`,X.style.left=Z.style.left,X.style.top=Z.style.top,this.overlay.appendChild(X)}hidePinTooltip(){this.overlay?.querySelectorAll(".pin-tooltip").forEach((Z)=>Z.remove())}highlightThreadInPanel(Z,$){let K=this.shadowRoot?.querySelector(`.thread-item[data-thread-id="${Z}"]`);if(K)if($)K.classList.add("thread-highlight");else K.classList.remove("thread-highlight")}renderBubble(Z,$,K){if(!this.overlay)return;let X=document.createElement("div");if(X.className="comment-bubble",Z>70)X.classList.add("comment-bubble-left");if(X.style.left=Z+"%",X.style.top=$+"%",X.addEventListener("click",(Y)=>Y.stopPropagation()),this.namePromptMode){X.innerHTML=`
        <div class="bubble-name-prompt">
          <p>Podaj swoje imię</p>
          <div class="bubble-name-row">
            <input type="text" class="bubble-name-input" placeholder="Twoje imię..." />
            <button class="btn btn-primary bubble-name-btn">OK</button>
          </div>
        </div>
      `;let Y=X.querySelector(".bubble-name-input"),G=X.querySelector(".bubble-name-btn"),Q=()=>{let J=Y.value.trim();if(J)this.saveAuthorName(J),this.renderPins()};G.addEventListener("click",Q),Y.addEventListener("keydown",(J)=>{if(J.key==="Enter")Q()}),setTimeout(()=>Y.focus(),0)}else if(K){let Y=K.comments.map((U,W)=>`
        <div class="bubble-comment ${W===0?"bubble-comment-original":"bubble-comment-reply"}">
          <div class="bubble-comment-header">
            <strong>${this.esc(U.author_name)}</strong>
            <span class="bubble-comment-time">${kZ(U.created_at)}</span>
          </div>
          <p>${this.esc(U.body)}</p>
        </div>
      `).join(""),G=this.submitting;X.innerHTML=`
        <div class="bubble-thread">
          <div class="bubble-comments">${Y}</div>
          <div class="bubble-reply-form">
            <textarea class="bubble-textarea" placeholder="Odpowiedz..." rows="2" ${G?"disabled":""}></textarea>
            <div class="bubble-reply-actions">
              <button class="btn btn-primary bubble-send-btn" ${G?"disabled":""}>${G?"Wysyłanie...":"Wyślij"}</button>
              <button class="bubble-cancel-compose-btn">Anuluj</button>
            </div>
          </div>
          <div class="bubble-actions">
            <button class="bubble-resolve-btn">${K.resolved?"Resolved":"Resolve"}</button>
            <button class="bubble-delete-btn">${this.confirmDeleteId===K.id?"Sure?":"Delete"}</button>
            ${this.confirmDeleteId===K.id?'<button class="bubble-cancel-btn">Cancel</button>':""}
          </div>
        </div>
      `;let Q=X.querySelector(".bubble-textarea");X.querySelector(".bubble-send-btn").addEventListener("click",()=>{this.addComment(K.id,Q.value),Q.value=""}),Q.addEventListener("keydown",(U)=>{if(U.key==="Enter"&&U.ctrlKey)this.addComment(K.id,Q.value),Q.value=""}),X.querySelector(".bubble-cancel-compose-btn").addEventListener("click",()=>{this.openThreadId=null,this.renderPins()}),X.querySelector(".bubble-resolve-btn").addEventListener("click",()=>this.resolveThread(K.id)),X.querySelector(".bubble-delete-btn").addEventListener("click",()=>this.deleteThread(K.id));let H=X.querySelector(".bubble-cancel-btn");if(H)H.addEventListener("click",()=>{this.confirmDeleteId=null,this.renderPins()})}else{let Y=this.submitting;X.innerHTML=`
        <div class="bubble-compose">
          <textarea class="bubble-textarea" placeholder="Napisz komentarz..." rows="2" ${Y?"disabled":""}></textarea>
          <div class="bubble-compose-actions">
            <button class="btn btn-primary bubble-send-btn" ${Y?"disabled":""}>${Y?"Wysyłanie...":"Wyślij"}</button>
            <button class="bubble-cancel-compose-btn">Anuluj</button>
          </div>
        </div>
      `;let G=X.querySelector(".bubble-textarea");X.querySelector(".bubble-send-btn").addEventListener("click",()=>this.createThread(G.value)),G.addEventListener("keydown",(F)=>{if(F.key==="Enter"&&F.ctrlKey)this.createThread(G.value)}),X.querySelector(".bubble-cancel-compose-btn").addEventListener("click",()=>{this.activeCompose=null,this.renderPins()}),setTimeout(()=>G.focus(),0)}this.overlay.appendChild(X)}esc(Z){let $=document.createElement("div");return $.textContent=Z,$.innerHTML}navigateToThread(Z){if(Z.page_path!==this.pagePath){this.pagePath=Z.page_path;let $=document.getElementById("page-select");if($)$.value=Z.page_path;let X=document.getElementById("mock-viewer")?.dataset.baseUrl||"";if(this.iframe)this.iframe.src=X+Z.page_path,this.iframe.addEventListener("load",()=>{this.syncOverlay(),setTimeout(()=>{this.scrollIframeToPin(Z.x_pct,Z.y_pct),this.openThreadId=Z.id,this.activeCompose=null,this.renderPins()},100)},{once:!0})}else this.scrollIframeToPin(Z.x_pct,Z.y_pct),this.openThreadId=Z.id,this.activeCompose=null,this.renderPins();setTimeout(()=>{let $=this.overlay?.querySelector(`.comment-pin[data-thread-id="${Z.id}"]`);if($)$.classList.add("pin-highlight"),setTimeout(()=>$.classList.remove("pin-highlight"),1500)},200)}scrollIframeToPin(Z,$){try{let K=this.iframe?.contentDocument;if(!K)return;let X=K.documentElement.scrollWidth,Y=K.documentElement.scrollHeight,G=this.iframe.clientWidth,Q=this.iframe.clientHeight,J=Z/100*X-G/2,F=$/100*Y-Q/2;K.documentElement.scrollTo({left:Math.max(0,J),top:Math.max(0,F),behavior:"smooth"})}catch(K){}}updated(){this.renderPins()}static styles=AZ`
    :host {
      display: flex;
      flex-direction: column;
      width: 340px;
      min-width: 340px;
      background: #f9f9fb;
      border-left: 1px solid #e0e0e0;
      height: 100%;
      overflow: hidden;
    }

    .comments-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .comments-header {
      padding: 12px 16px 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .comments-header h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .comment-count {
      font-size: 13px;
      color: #888;
      margin-left: 8px;
    }

    .comments-view-toggle {
      display: flex;
      gap: 0;
      margin-bottom: 8px;
    }

    .toggle-btn {
      flex: 1;
      padding: 4px 12px;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .toggle-btn:first-child { border-radius: 4px 0 0 4px; }
    .toggle-btn:last-child { border-radius: 0 4px 4px 0; }
    .toggle-btn.active {
      background: #333;
      color: #fff;
      border-color: #333;
    }

    .hide-resolved-toggle {
      display: flex;
      gap: 0;
      margin-top: 4px;
    }

    .hide-toggle-btn {
      flex: 1;
      padding: 4px 12px;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .hide-toggle-btn:first-child { border-radius: 4px 0 0 4px; }
    .hide-toggle-btn:last-child { border-radius: 0 4px 4px 0; }
    .hide-toggle-btn.active {
      background: #333;
      color: #fff;
      border-color: #333;
    }

    .thread-list {
      padding: 0;
    }

    .thread-item {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background 0.15s;
    }
    .thread-item:hover, .thread-item.thread-highlight {
      background: #eef3ff;
    }

    .thread-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }

    .thread-pin-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ff4444;
      color: #fff;
      font-size: 11px;
      font-weight: bold;
    }

    .thread-author {
      font-weight: 600;
    }

    .thread-time {
      color: #999;
      font-size: 11px;
    }

    .thread-page {
      color: #999;
      font-size: 11px;
    }

    .thread-body {
      margin: 2px 0 0;
      font-size: 13px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .thread-reply-count {
      font-size: 11px;
      color: #888;
      margin-top: 2px;
    }

    .page-group-header {
      padding: 6px 16px;
      background: #eee;
      font-size: 12px;
      font-weight: 600;
      color: #555;
    }

    .resolved-section h4 {
      padding: 8px 16px 4px;
      margin: 0;
      font-size: 13px;
      color: #888;
    }

    .resolved-item {
      padding: 8px 16px;
      border-bottom: 1px solid #eee;
      opacity: 0.6;
      font-size: 13px;
    }

    .change-name-section {
      padding: 8px 16px;
      border-top: 1px solid #e0e0e0;
    }

    .btn-change-name {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 12px;
      padding: 0;
      text-decoration: underline;
    }
  `;render(){let Z=this.showAll?this.threads:this.threads.filter((Q)=>Q.page_path===this.pagePath),$=Z.filter((Q)=>!Q.resolved),K=Z.filter((Q)=>Q.resolved),X=this.threads.filter((Q)=>Q.page_path===this.pagePath&&!Q.resolved),Y=new Map;X.forEach((Q,J)=>Y.set(Q.id,J+1));let G=(Q)=>{return[...new Set(Q.map((F)=>F.page_path))].map((F)=>({page:F,threads:Q.filter((N)=>N.page_path===F)}))};return R`
      <div class="comments-scroll">
        <div class="comments-header">
          <h3>Comments <span class="comment-count">${$.length}</span></h3>
          <div class="comments-view-toggle">
            <button class="toggle-btn ${!this.showAll?"active":""}"
              @click=${()=>{this.showAll=!1}}>Ta strona</button>
            <button class="toggle-btn ${this.showAll?"active":""}"
              @click=${()=>{this.showAll=!0}}>Wszystkie</button>
          </div>
          <div class="hide-resolved-toggle">
            <button class="hide-toggle-btn ${!this.hideResolved?"active":""}"
              @click=${()=>{this.hideResolved=!1}}>Show resolved</button>
            <button class="hide-toggle-btn ${this.hideResolved?"active":""}"
              @click=${()=>{this.hideResolved=!0}}>Hide resolved</button>
          </div>
        </div>

        <div class="thread-list">
          ${this.showAll?G($).map((Q)=>R`
                <div class="comment-page-group">
                  <div class="page-group-header">${this.basename(Q.page)}</div>
                  ${Q.threads.map((J)=>this.renderThreadItem(J,Y.get(J.id)))}
                </div>
              `):$.map((Q)=>this.renderThreadItem(Q,Y.get(Q.id)))}
        </div>

        ${K.length>0&&!this.hideResolved?R`
          <div class="resolved-section">
            <h4>Resolved</h4>
            ${this.showAll?G(K).map((Q)=>R`
                  <div class="comment-page-group">
                    <div class="page-group-header">${this.basename(Q.page)}</div>
                    ${Q.threads.map((J)=>this.renderResolvedItem(J))}
                  </div>
                `):K.map((Q)=>this.renderResolvedItem(Q))}
          </div>
        `:B}
      </div>

      <div class="change-name-section">
        <button class="btn-change-name" id="change-name-btn"
          @click=${()=>this.changeName()}>zmie\u0144 imi\u0119</button>
      </div>
    `}renderThreadItem(Z,$){let K=Z.comments[0],X=Z.comments.length-1;return R`
      <div class="thread-item" data-thread-id=${Z.id}
        @click=${()=>this.navigateToThread(Z)}
        @mouseenter=${()=>this.highlightPin(Z.id,!0)}
        @mouseleave=${()=>this.highlightPin(Z.id,!1)}>
        <div class="thread-meta">
          ${$?R`<span class="thread-pin-num">${$}</span>`:B}
          <span class="thread-author">${K?.author_name||""}</span>
          <span class="thread-time">${K?kZ(K.created_at):""}</span>
          <span class="thread-page">${this.basename(Z.page_path)}</span>
        </div>
        <div class="thread-body">${K?.body||""}</div>
        ${X>0?R`<div class="thread-reply-count">${X} ${X===1?"odpowiedź":"odpowiedzi"}</div>`:B}
      </div>
    `}renderResolvedItem(Z){let $=Z.comments[0];return R`
      <div class="resolved-item">
        <strong>${$?.author_name||""}</strong>
        <span class="thread-time" style="margin-left: 8px; font-size: 11px;">${$?kZ($.created_at):""}</span>
        <p style="margin:2px 0 0">${$?.body||""}</p>
      </div>
    `}highlightPin(Z,$){let K=this.overlay?.querySelector(`.comment-pin[data-thread-id="${Z}"]`);if(K)if($)K.classList.add("pin-highlight");else K.classList.remove("pin-highlight")}basename(Z){let $=Z.split("/");return $[$.length-1]||Z}}k([l({type:Number,attribute:"mock-id"})],jZ.prototype,"mockId",void 0),k([l({type:String,attribute:"entry-file"})],jZ.prototype,"entryFile",void 0),k([V()],jZ.prototype,"pagePath",void 0),k([V()],jZ.prototype,"threads",void 0),k([V()],jZ.prototype,"authorName",void 0),k([V()],jZ.prototype,"showAll",void 0),k([V()],jZ.prototype,"hideResolved",void 0),k([V()],jZ.prototype,"confirmDeleteId",void 0),k([V()],jZ.prototype,"activeCompose",void 0),k([V()],jZ.prototype,"openThreadId",void 0),k([V()],jZ.prototype,"namePromptMode",void 0),k([V()],jZ.prototype,"submitting",void 0),k([V()],jZ.prototype,"commentMode",void 0),jZ=k([uZ("smock-comments")],jZ);export{jZ as SmockComments};
