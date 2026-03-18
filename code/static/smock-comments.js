var U=function(Z,$,K,X){var Y=arguments.length,G=Y<3?$:X===null?X=Object.getOwnPropertyDescriptor($,K):X,Q;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")G=Reflect.decorate(Z,$,K,X);else for(var J=Z.length-1;J>=0;J--)if(Q=Z[J])G=(Y<3?Q(G):Y>3?Q($,K,G):Q($,K))||G;return Y>3&&G&&Object.defineProperty($,K,G),G};var l=globalThis,ZZ=l.ShadowRoot&&(l.ShadyCSS===void 0||l.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$Z=Symbol(),jZ=new WeakMap;class KZ{constructor(Z,$,K){if(this._$cssResult$=!0,K!==$Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=Z,this._strings=$}get styleSheet(){let Z=this._styleSheet,$=this._strings;if(ZZ&&Z===void 0){let K=$!==void 0&&$.length===1;if(K)Z=jZ.get($);if(Z===void 0){if((this._styleSheet=Z=new CSSStyleSheet).replaceSync(this.cssText),K)jZ.set($,Z)}}return Z}toString(){return this.cssText}}var pZ=(Z)=>{if(Z._$cssResult$===!0)return Z.cssText;else if(typeof Z==="number")return Z;else throw Error(`Value passed to 'css' function must be a 'css' function result: ${Z}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)},iZ=(Z)=>new KZ(typeof Z==="string"?Z:String(Z),void 0,$Z),_Z=(Z,...$)=>{let K=Z.length===1?Z[0]:$.reduce((X,Y,G)=>X+pZ(Y)+Z[G+1],Z[0]);return new KZ(K,Z,$Z)},AZ=(Z,$)=>{if(ZZ)Z.adoptedStyleSheets=$.map((K)=>K instanceof CSSStyleSheet?K:K.styleSheet);else for(let K of $){let X=document.createElement("style"),Y=l.litNonce;if(Y!==void 0)X.setAttribute("nonce",Y);X.textContent=K.cssText,Z.appendChild(X)}},lZ=(Z)=>{let $="";for(let K of Z.cssRules)$+=K.cssText;return iZ($)},XZ=ZZ?(Z)=>Z:(Z)=>Z instanceof CSSStyleSheet?lZ(Z):Z;var{is:sZ,defineProperty:oZ,getOwnPropertyDescriptor:MZ,getOwnPropertyNames:rZ,getOwnPropertySymbols:nZ,getPrototypeOf:NZ}=Object,aZ=!1,j=globalThis;if(aZ)j.customElements??=customElements;var _=!0,I,VZ=j.trustedTypes,tZ=VZ?VZ.emptyScript:"",LZ=_?j.reactiveElementPolyfillSupportDevMode:j.reactiveElementPolyfillSupport;if(_)j.litIssuedWarnings??=new Set,I=(Z,$)=>{if($+=` See https://lit.dev/msg/${Z} for more information.`,!j.litIssuedWarnings.has($)&&!j.litIssuedWarnings.has(Z))console.warn($),j.litIssuedWarnings.add($)},queueMicrotask(()=>{if(I("dev-mode","Lit is in dev mode. Not recommended for production!"),j.ShadyDOM?.inUse&&LZ===void 0)I("polyfill-support-missing","Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.")});var eZ=_?(Z)=>{if(!j.emitLitDebugLogEvents)return;j.dispatchEvent(new CustomEvent("lit-debug",{detail:Z}))}:void 0,y=(Z,$)=>Z,b={toAttribute(Z,$){switch($){case Boolean:Z=Z?tZ:null;break;case Object:case Array:Z=Z==null?Z:JSON.stringify(Z);break}return Z},fromAttribute(Z,$){let K=Z;switch($){case Boolean:K=Z!==null;break;case Number:K=Z===null?null:Number(Z);break;case Object:case Array:try{K=JSON.parse(Z)}catch(X){K=null}break}return K}},s=(Z,$)=>!sZ(Z,$),IZ={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:s};Symbol.metadata??=Symbol("metadata");j.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(Z){this.__prepare(),(this._initializers??=[]).push(Z)}static get observedAttributes(){return this.finalize(),this.__attributeToPropertyMap&&[...this.__attributeToPropertyMap.keys()]}static createProperty(Z,$=IZ){if($.state)$.attribute=!1;if(this.__prepare(),this.prototype.hasOwnProperty(Z))$=Object.create($),$.wrapped=!0;if(this.elementProperties.set(Z,$),!$.noAccessor){let K=_?Symbol.for(`${String(Z)} (@property() cache)`):Symbol(),X=this.getPropertyDescriptor(Z,K,$);if(X!==void 0)oZ(this.prototype,Z,X)}}static getPropertyDescriptor(Z,$,K){let{get:X,set:Y}=MZ(this.prototype,Z)??{get(){return this[$]},set(G){this[$]=G}};if(_&&X==null){if("value"in(MZ(this.prototype,Z)??{}))throw Error(`Field ${JSON.stringify(String(Z))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);I("reactive-property-without-getter",`Field ${JSON.stringify(String(Z))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`)}return{get:X,set(G){let Q=X?.call(this);Y?.call(this,G),this.requestUpdate(Z,Q,K)},configurable:!0,enumerable:!0}}static getPropertyOptions(Z){return this.elementProperties.get(Z)??IZ}static __prepare(){if(this.hasOwnProperty(y("elementProperties",this)))return;let Z=NZ(this);if(Z.finalize(),Z._initializers!==void 0)this._initializers=[...Z._initializers];this.elementProperties=new Map(Z.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized",this)))return;if(this.finalized=!0,this.__prepare(),this.hasOwnProperty(y("properties",this))){let $=this.properties,K=[...rZ($),...nZ($)];for(let X of K)this.createProperty(X,$[X])}let Z=this[Symbol.metadata];if(Z!==null){let $=litPropertyMetadata.get(Z);if($!==void 0)for(let[K,X]of $)this.elementProperties.set(K,X)}this.__attributeToPropertyMap=new Map;for(let[$,K]of this.elementProperties){let X=this.__attributeNameForProperty($,K);if(X!==void 0)this.__attributeToPropertyMap.set(X,$)}if(this.elementStyles=this.finalizeStyles(this.styles),_){if(this.hasOwnProperty("createProperty"))I("no-override-create-property","Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");if(this.hasOwnProperty("getPropertyDescriptor"))I("no-override-get-property-descriptor","Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators")}}static finalizeStyles(Z){let $=[];if(Array.isArray(Z)){let K=new Set(Z.flat(1/0).reverse());for(let X of K)$.unshift(XZ(X))}else if(Z!==void 0)$.push(XZ(Z));return $}static __attributeNameForProperty(Z,$){let K=$.attribute;return K===!1?void 0:typeof K==="string"?K:typeof Z==="string"?Z.toLowerCase():void 0}constructor(){super();this.__instanceProperties=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.__reflectingProperty=null,this.__initialize()}__initialize(){this.__updatePromise=new Promise((Z)=>this.enableUpdating=Z),this._$changedProperties=new Map,this.__saveInstanceProperties(),this.requestUpdate(),this.constructor._initializers?.forEach((Z)=>Z(this))}addController(Z){if((this.__controllers??=new Set).add(Z),this.renderRoot!==void 0&&this.isConnected)Z.hostConnected?.()}removeController(Z){this.__controllers?.delete(Z)}__saveInstanceProperties(){let Z=new Map,$=this.constructor.elementProperties;for(let K of $.keys())if(this.hasOwnProperty(K))Z.set(K,this[K]),delete this[K];if(Z.size>0)this.__instanceProperties=Z}createRenderRoot(){let Z=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return AZ(Z,this.constructor.elementStyles),Z}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.__controllers?.forEach((Z)=>Z.hostConnected?.())}enableUpdating(Z){}disconnectedCallback(){this.__controllers?.forEach((Z)=>Z.hostDisconnected?.())}attributeChangedCallback(Z,$,K){this._$attributeToProperty(Z,K)}__propertyToAttribute(Z,$){let X=this.constructor.elementProperties.get(Z),Y=this.constructor.__attributeNameForProperty(Z,X);if(Y!==void 0&&X.reflect===!0){let Q=(X.converter?.toAttribute!==void 0?X.converter:b).toAttribute($,X.type);if(_&&this.constructor.enabledWarnings.includes("migration")&&Q===void 0)I("undefined-attribute-value",`The attribute value for the ${Z} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);if(this.__reflectingProperty=Z,Q==null)this.removeAttribute(Y);else this.setAttribute(Y,Q);this.__reflectingProperty=null}}_$attributeToProperty(Z,$){let K=this.constructor,X=K.__attributeToPropertyMap.get(Z);if(X!==void 0&&this.__reflectingProperty!==X){let Y=K.getPropertyOptions(X),G=typeof Y.converter==="function"?{fromAttribute:Y.converter}:Y.converter?.fromAttribute!==void 0?Y.converter:b;this.__reflectingProperty=X;let Q=G.fromAttribute($,Y.type);this[X]=Q??this.__defaultValues?.get(X)??Q,this.__reflectingProperty=null}}requestUpdate(Z,$,K,X=!1,Y){if(Z!==void 0){if(_&&Z instanceof Event)I("","The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()");let G=this.constructor;if(X===!1)Y=this[Z];if(K??=G.getPropertyOptions(Z),(K.hasChanged??s)(Y,$)||K.useDefault&&K.reflect&&Y===this.__defaultValues?.get(Z)&&!this.hasAttribute(G.__attributeNameForProperty(Z,K)))this._$changeProperty(Z,$,K);else return}if(this.isUpdatePending===!1)this.__updatePromise=this.__enqueueUpdate()}_$changeProperty(Z,$,{useDefault:K,reflect:X,wrapped:Y},G){if(K&&!(this.__defaultValues??=new Map).has(Z)){if(this.__defaultValues.set(Z,G??$??this[Z]),Y!==!0||G!==void 0)return}if(!this._$changedProperties.has(Z)){if(!this.hasUpdated&&!K)$=void 0;this._$changedProperties.set(Z,$)}if(X===!0&&this.__reflectingProperty!==Z)(this.__reflectingProperties??=new Set).add(Z)}async __enqueueUpdate(){this.isUpdatePending=!0;try{await this.__updatePromise}catch($){Promise.reject($)}let Z=this.scheduleUpdate();if(Z!=null)await Z;return!this.isUpdatePending}scheduleUpdate(){let Z=this.performUpdate();if(_&&this.constructor.enabledWarnings.includes("async-perform-update")&&typeof Z?.then==="function")I("async-perform-update",`Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);return Z}performUpdate(){if(!this.isUpdatePending)return;if(eZ?.({kind:"update"}),!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),_){let Y=[...this.constructor.elementProperties.keys()].filter((G)=>this.hasOwnProperty(G)&&(G in NZ(this)));if(Y.length)throw Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${Y.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`)}if(this.__instanceProperties){for(let[X,Y]of this.__instanceProperties)this[X]=Y;this.__instanceProperties=void 0}let K=this.constructor.elementProperties;if(K.size>0)for(let[X,Y]of K){let{wrapped:G}=Y,Q=this[X];if(G===!0&&!this._$changedProperties.has(X)&&Q!==void 0)this._$changeProperty(X,void 0,Y,Q)}}let Z=!1,$=this._$changedProperties;try{if(Z=this.shouldUpdate($),Z)this.willUpdate($),this.__controllers?.forEach((K)=>K.hostUpdate?.()),this.update($);else this.__markUpdated()}catch(K){throw Z=!1,this.__markUpdated(),K}if(Z)this._$didUpdate($)}willUpdate(Z){}_$didUpdate(Z){if(this.__controllers?.forEach(($)=>$.hostUpdated?.()),!this.hasUpdated)this.hasUpdated=!0,this.firstUpdated(Z);if(this.updated(Z),_&&this.isUpdatePending&&this.constructor.enabledWarnings.includes("change-in-update"))I("change-in-update",`Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`)}__markUpdated(){this._$changedProperties=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.__updatePromise}shouldUpdate(Z){return!0}update(Z){this.__reflectingProperties&&=this.__reflectingProperties.forEach(($)=>this.__propertyToAttribute($,this[$])),this.__markUpdated()}updated(Z){}firstUpdated(Z){}}A.elementStyles=[];A.shadowRootOptions={mode:"open"};A[y("elementProperties",A)]=new Map;A[y("finalized",A)]=new Map;LZ?.({ReactiveElement:A});if(_){A.enabledWarnings=["change-in-update","async-perform-update"];let Z=function($){if(!$.hasOwnProperty(y("enabledWarnings",$)))$.enabledWarnings=$.enabledWarnings.slice()};A.enableWarning=function($){if(Z(this),!this.enabledWarnings.includes($))this.enabledWarnings.push($)},A.disableWarning=function($){Z(this);let K=this.enabledWarnings.indexOf($);if(K>=0)this.enabledWarnings.splice(K,1)}}(j.reactiveElementVersions??=[]).push("2.1.2");if(_&&j.reactiveElementVersions.length>1)queueMicrotask(()=>{I("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var M=globalThis,q=(Z)=>{if(!M.emitLitDebugLogEvents)return;M.dispatchEvent(new CustomEvent("lit-debug",{detail:Z}))},Z0=0,c;M.litIssuedWarnings??=new Set,c=(Z,$)=>{if($+=Z?` See https://lit.dev/msg/${Z} for more information.`:"",!M.litIssuedWarnings.has($)&&!M.litIssuedWarnings.has(Z))console.warn($),M.litIssuedWarnings.add($)},queueMicrotask(()=>{c("dev-mode","Lit is in dev mode. Not recommended for production!")});var L=M.ShadyDOM?.inUse&&M.ShadyDOM?.noPatch===!0?M.ShadyDOM.wrap:(Z)=>Z,o=M.trustedTypes,DZ=o?o.createPolicy("lit-html",{createHTML:(Z)=>Z}):void 0,$0=(Z)=>Z,t=(Z,$,K)=>$0,K0=(Z)=>{if(E!==t)throw Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");E=Z},X0=()=>{E=t},FZ=(Z,$,K)=>{return E(Z,$,K)},PZ="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,wZ="?"+R,Y0=`<${wZ}>`,P=document,v=()=>P.createComment(""),m=(Z)=>Z===null||typeof Z!="object"&&typeof Z!="function",qZ=Array.isArray,G0=(Z)=>qZ(Z)||typeof Z?.[Symbol.iterator]==="function",YZ=`[ 	
\f\r]`,Q0=`[^ 	
\f\r"'\`<>=]`,J0=`[^\\s"'>=/]`,h=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,RZ=1,GZ=2,F0=3,TZ=/-->/g,fZ=/>/g,O=new RegExp(`>|${YZ}(?:(${J0}+)(${YZ}*=${YZ}*(?:${Q0}|("|')|))|$)`,"g"),q0=0,OZ=1,z0=2,CZ=3,QZ=/'/g,JZ=/"/g,EZ=/^(?:script|style|textarea|title)$/i,H0=1,r=2,n=3,zZ=1,a=2,B0=3,W0=4,k0=5,HZ=6,U0=7,BZ=(Z)=>($,...K)=>{if($.some((X)=>X===void 0))console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`);if(K.some((X)=>X?._$litStatic$))c("",`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);return{["_$litType$"]:Z,strings:$,values:K}},T=BZ(H0),S0=BZ(r),P0=BZ(n),w=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),SZ=new WeakMap,S=P.createTreeWalker(P,129),E=t;function yZ(Z,$){if(!qZ(Z)||!Z.hasOwnProperty("raw")){let K="invalid template strings array";throw K=`
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
`),Error(K)}return DZ!==void 0?DZ.createHTML($):$}var j0=(Z,$)=>{let K=Z.length-1,X=[],Y=$===r?"<svg>":$===n?"<math>":"",G,Q=h;for(let F=0;F<K;F++){let k=Z[F],z=-1,W,V=0,H;while(V<k.length){if(Q.lastIndex=V,H=Q.exec(k),H===null)break;if(V=Q.lastIndex,Q===h){if(H[RZ]==="!--")Q=TZ;else if(H[RZ]!==void 0)Q=fZ;else if(H[GZ]!==void 0){if(EZ.test(H[GZ]))G=new RegExp(`</${H[GZ]}`,"g");Q=O}else if(H[F0]!==void 0)throw Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions")}else if(Q===O)if(H[q0]===">")Q=G??h,z=-1;else if(H[OZ]===void 0)z=-2;else z=Q.lastIndex-H[z0].length,W=H[OZ],Q=H[CZ]===void 0?O:H[CZ]==='"'?JZ:QZ;else if(Q===JZ||Q===QZ)Q=O;else if(Q===TZ||Q===fZ)Q=h;else Q=O,G=void 0}console.assert(z===-1||Q===O||Q===QZ||Q===JZ,"unexpected parse state B");let D=Q===O&&Z[F+1].startsWith("/>")?" ":"";Y+=Q===h?k+Y0:z>=0?(X.push(W),k.slice(0,z)+PZ+k.slice(z))+R+D:k+R+(z===-2?F:D)}let J=Y+(Z[K]||"<?>")+($===r?"</svg>":$===n?"</math>":"");return[yZ(Z,J),X]};class u{constructor({strings:Z,["_$litType$"]:$},K){this.parts=[];let X,Y=0,G=0,Q=Z.length-1,J=this.parts,[F,k]=j0(Z,$);if(this.el=u.createElement(F,K),S.currentNode=this.el.content,$===r||$===n){let z=this.el.content.firstChild;z.replaceWith(...z.childNodes)}while((X=S.nextNode())!==null&&J.length<Q){if(X.nodeType===1){{let z=X.localName;if(/^(?:textarea|template)$/i.test(z)&&X.innerHTML.includes(R)){let W=`Expressions are not supported inside \`${z}\` elements. See https://lit.dev/msg/expression-in-${z} for more information.`;if(z==="template")throw Error(W);else c("",W)}}if(X.hasAttributes()){for(let z of X.getAttributeNames())if(z.endsWith(PZ)){let W=k[G++],H=X.getAttribute(z).split(R),D=/([.?@])?(.*)/.exec(W);J.push({type:zZ,index:Y,name:D[2],strings:H,ctor:D[1]==="."?bZ:D[1]==="?"?hZ:D[1]==="@"?gZ:p}),X.removeAttribute(z)}else if(z.startsWith(R))J.push({type:HZ,index:Y}),X.removeAttribute(z)}if(EZ.test(X.tagName)){let z=X.textContent.split(R),W=z.length-1;if(W>0){X.textContent=o?o.emptyScript:"";for(let V=0;V<W;V++)X.append(z[V],v()),S.nextNode(),J.push({type:a,index:++Y});X.append(z[W],v())}}}else if(X.nodeType===8)if(X.data===wZ)J.push({type:a,index:Y});else{let W=-1;while((W=X.data.indexOf(R,W+1))!==-1)J.push({type:U0,index:Y}),W+=R.length-1}Y++}if(k.length!==G)throw Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`'+Z.join("${...}")+"`");q&&q({kind:"template prep",template:this,clonableTemplate:this.el,parts:this.parts,strings:Z})}static createElement(Z,$){let K=P.createElement("template");return K.innerHTML=Z,K}}function x(Z,$,K=Z,X){if($===w)return $;let Y=X!==void 0?K.__directives?.[X]:K.__directive,G=m($)?void 0:$._$litDirective$;if(Y?.constructor!==G){if(Y?._$notifyDirectiveConnectionChanged?.(!1),G===void 0)Y=void 0;else Y=new G(Z),Y._$initialize(Z,K,X);if(X!==void 0)(K.__directives??=[])[X]=Y;else K.__directive=Y}if(Y!==void 0)$=x(Z,Y._$resolve(Z,$.values),Y,X);return $}class xZ{constructor(Z,$){this._$parts=[],this._$disconnectableChildren=void 0,this._$template=Z,this._$parent=$}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone(Z){let{el:{content:$},parts:K}=this._$template,X=(Z?.creationScope??P).importNode($,!0);S.currentNode=X;let Y=S.nextNode(),G=0,Q=0,J=K[0];while(J!==void 0){if(G===J.index){let F;if(J.type===a)F=new d(Y,Y.nextSibling,this,Z);else if(J.type===zZ)F=new J.ctor(Y,J.name,J.strings,this,Z);else if(J.type===HZ)F=new cZ(Y,this,Z);this._$parts.push(F),J=K[++Q]}if(G!==J?.index)Y=S.nextNode(),G++}return S.currentNode=P,X}_update(Z){let $=0;for(let K of this._$parts){if(K!==void 0)if(q&&q({kind:"set part",part:K,value:Z[$],valueIndex:$,values:Z,templateInstance:this}),K.strings!==void 0)K._$setValue(Z,K,$),$+=K.strings.length-2;else K._$setValue(Z[$]);$++}}}class d{get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor(Z,$,K,X){this.type=a,this._$committedValue=B,this._$disconnectableChildren=void 0,this._$startNode=Z,this._$endNode=$,this._$parent=K,this.options=X,this.__isConnected=X?.isConnected??!0,this._textSanitizer=void 0}get parentNode(){let Z=L(this._$startNode).parentNode,$=this._$parent;if($!==void 0&&Z?.nodeType===11)Z=$.parentNode;return Z}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue(Z,$=this){if(this.parentNode===null)throw Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");if(Z=x(this,Z,$),m(Z)){if(Z===B||Z==null||Z===""){if(this._$committedValue!==B)q&&q({kind:"commit nothing to child",start:this._$startNode,end:this._$endNode,parent:this._$parent,options:this.options}),this._$clear();this._$committedValue=B}else if(Z!==this._$committedValue&&Z!==w)this._commitText(Z)}else if(Z._$litType$!==void 0)this._commitTemplateResult(Z);else if(Z.nodeType!==void 0){if(this.options?.host===Z){this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"),console.warn("Attempted to render the template host",Z,"inside itself. This is almost always a mistake, and in dev mode ","we render some warning text. In production however, we'll ","render it, which will usually result in an error, and sometimes ","in the element disappearing from the DOM.");return}this._commitNode(Z)}else if(G0(Z))this._commitIterable(Z);else this._commitText(Z)}_insert(Z){return L(L(this._$startNode).parentNode).insertBefore(Z,this._$endNode)}_commitNode(Z){if(this._$committedValue!==Z){if(this._$clear(),E!==t){let $=this._$startNode.parentNode?.nodeName;if($==="STYLE"||$==="SCRIPT"){let K="Forbidden";if($==="STYLE")K="Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.";else K="Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.";throw Error(K)}}q&&q({kind:"commit node",start:this._$startNode,parent:this._$parent,value:Z,options:this.options}),this._$committedValue=this._insert(Z)}}_commitText(Z){if(this._$committedValue!==B&&m(this._$committedValue)){let $=L(this._$startNode).nextSibling;if(this._textSanitizer===void 0)this._textSanitizer=FZ($,"data","property");Z=this._textSanitizer(Z),q&&q({kind:"commit text",node:$,value:Z,options:this.options}),$.data=Z}else{let $=P.createTextNode("");if(this._commitNode($),this._textSanitizer===void 0)this._textSanitizer=FZ($,"data","property");Z=this._textSanitizer(Z),q&&q({kind:"commit text",node:$,value:Z,options:this.options}),$.data=Z}this._$committedValue=Z}_commitTemplateResult(Z){let{values:$,["_$litType$"]:K}=Z,X=typeof K==="number"?this._$getTemplate(Z):(K.el===void 0&&(K.el=u.createElement(yZ(K.h,K.h[0]),this.options)),K);if(this._$committedValue?._$template===X)q&&q({kind:"template updating",template:X,instance:this._$committedValue,parts:this._$committedValue._$parts,options:this.options,values:$}),this._$committedValue._update($);else{let Y=new xZ(X,this),G=Y._clone(this.options);q&&q({kind:"template instantiated",template:X,instance:Y,parts:Y._$parts,options:this.options,fragment:G,values:$}),Y._update($),q&&q({kind:"template instantiated and updated",template:X,instance:Y,parts:Y._$parts,options:this.options,fragment:G,values:$}),this._commitNode(G),this._$committedValue=Y}}_$getTemplate(Z){let $=SZ.get(Z.strings);if($===void 0)SZ.set(Z.strings,$=new u(Z));return $}_commitIterable(Z){if(!qZ(this._$committedValue))this._$committedValue=[],this._$clear();let $=this._$committedValue,K=0,X;for(let Y of Z){if(K===$.length)$.push(X=new d(this._insert(v()),this._insert(v()),this,this.options));else X=$[K];X._$setValue(Y),K++}if(K<$.length)this._$clear(X&&L(X._$endNode).nextSibling,K),$.length=K}_$clear(Z=L(this._$startNode).nextSibling,$){this._$notifyConnectionChanged?.(!1,!0,$);while(Z!==this._$endNode){let K=L(Z).nextSibling;L(Z).remove(),Z=K}}setConnected(Z){if(this._$parent===void 0)this.__isConnected=Z,this._$notifyConnectionChanged?.(Z);else throw Error("part.setConnected() may only be called on a RootPart returned from render().")}}class p{get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor(Z,$,K,X,Y){if(this.type=zZ,this._$committedValue=B,this._$disconnectableChildren=void 0,this.element=Z,this.name=$,this._$parent=X,this.options=Y,K.length>2||K[0]!==""||K[1]!=="")this._$committedValue=Array(K.length-1).fill(new String),this.strings=K;else this._$committedValue=B;this._sanitizer=void 0}_$setValue(Z,$=this,K,X){let Y=this.strings,G=!1;if(Y===void 0){if(Z=x(this,Z,$,0),G=!m(Z)||Z!==this._$committedValue&&Z!==w,G)this._$committedValue=Z}else{let Q=Z;Z=Y[0];let J,F;for(J=0;J<Y.length-1;J++){if(F=x(this,Q[K+J],$,J),F===w)F=this._$committedValue[J];if(G||=!m(F)||F!==this._$committedValue[J],F===B)Z=B;else if(Z!==B)Z+=(F??"")+Y[J+1];this._$committedValue[J]=F}}if(G&&!X)this._commitValue(Z)}_commitValue(Z){if(Z===B)L(this.element).removeAttribute(this.name);else{if(this._sanitizer===void 0)this._sanitizer=E(this.element,this.name,"attribute");Z=this._sanitizer(Z??""),q&&q({kind:"commit attribute",element:this.element,name:this.name,value:Z,options:this.options}),L(this.element).setAttribute(this.name,Z??"")}}}class bZ extends p{constructor(){super(...arguments);this.type=B0}_commitValue(Z){if(this._sanitizer===void 0)this._sanitizer=E(this.element,this.name,"property");Z=this._sanitizer(Z),q&&q({kind:"commit property",element:this.element,name:this.name,value:Z,options:this.options}),this.element[this.name]=Z===B?void 0:Z}}class hZ extends p{constructor(){super(...arguments);this.type=W0}_commitValue(Z){q&&q({kind:"commit boolean attribute",element:this.element,name:this.name,value:!!(Z&&Z!==B),options:this.options}),L(this.element).toggleAttribute(this.name,!!Z&&Z!==B)}}class gZ extends p{constructor(Z,$,K,X,Y){super(Z,$,K,X,Y);if(this.type=k0,this.strings!==void 0)throw Error(`A \`<${Z.localName}>\` has a \`@${$}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`)}_$setValue(Z,$=this){if(Z=x(this,Z,$,0)??B,Z===w)return;let K=this._$committedValue,X=Z===B&&K!==B||Z.capture!==K.capture||Z.once!==K.once||Z.passive!==K.passive,Y=Z!==B&&(K===B||X);if(q&&q({kind:"commit event listener",element:this.element,name:this.name,value:Z,options:this.options,removeListener:X,addListener:Y,oldListener:K}),X)this.element.removeEventListener(this.name,this,K);if(Y)this.element.addEventListener(this.name,this,Z);this._$committedValue=Z}handleEvent(Z){if(typeof this._$committedValue==="function")this._$committedValue.call(this.options?.host??this.element,Z);else this._$committedValue.handleEvent(Z)}}class cZ{constructor(Z,$,K){this.element=Z,this.type=HZ,this._$disconnectableChildren=void 0,this._$parent=$,this.options=K}get _$isConnected(){return this._$parent._$isConnected}_$setValue(Z){q&&q({kind:"commit to element binding",element:this.element,value:Z,options:this.options}),x(this,Z)}}var _0=M.litHtmlPolyfillSupportDevMode;_0?.(u,d);(M.litHtmlVersions??=[]).push("3.3.2");if(M.litHtmlVersions.length>1)queueMicrotask(()=>{c("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var g=(Z,$,K)=>{if($==null)throw TypeError(`The container to render into may not be ${$}`);let X=Z0++,Y=K?.renderBefore??$,G=Y._$litPart$;if(q&&q({kind:"begin render",id:X,value:Z,container:$,options:K,part:G}),G===void 0){let Q=K?.renderBefore??null;Y._$litPart$=G=new d($.insertBefore(v(),Q),Q,void 0,K??{})}return G._$setValue(Z),q&&q({kind:"end render",id:X,value:Z,container:$,options:K,part:G}),G};g.setSanitizer=K0,g.createSanitizer=FZ,g._testOnlyClearSanitizerFactoryDoNotCallOrElse=X0;var A0=(Z,$)=>Z,WZ=!0,f=globalThis,vZ;if(WZ)f.litIssuedWarnings??=new Set,vZ=(Z,$)=>{if($+=` See https://lit.dev/msg/${Z} for more information.`,!f.litIssuedWarnings.has($)&&!f.litIssuedWarnings.has(Z))console.warn($),f.litIssuedWarnings.add($)};class C extends A{constructor(){super(...arguments);this.renderOptions={host:this},this.__childPart=void 0}createRenderRoot(){let Z=super.createRenderRoot();return this.renderOptions.renderBefore??=Z.firstChild,Z}update(Z){let $=this.render();if(!this.hasUpdated)this.renderOptions.isConnected=this.isConnected;super.update(Z),this.__childPart=g($,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.__childPart?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.__childPart?.setConnected(!1)}render(){return w}}C._$litElement$=!0;C[A0("finalized",C)]=!0;f.litElementHydrateSupport?.({LitElement:C});var M0=WZ?f.litElementPolyfillSupportDevMode:f.litElementPolyfillSupport;M0?.({LitElement:C});(f.litElementVersions??=[]).push("4.2.2");if(WZ&&f.litElementVersions.length>1)queueMicrotask(()=>{vZ("multiple-versions","Multiple versions of Lit loaded. Loading multiple versions is not recommended.")});var mZ=(Z)=>($,K)=>{if(K!==void 0)K.addInitializer(()=>{customElements.define(Z,$)});else customElements.define(Z,$)};var uZ=!0,dZ;if(uZ)globalThis.litIssuedWarnings??=new Set,dZ=(Z,$)=>{if($+=` See https://lit.dev/msg/${Z} for more information.`,!globalThis.litIssuedWarnings.has($)&&!globalThis.litIssuedWarnings.has(Z))console.warn($),globalThis.litIssuedWarnings.add($)};var N0=(Z,$,K)=>{let X=$.hasOwnProperty(K);return $.constructor.createProperty(K,Z),X?Object.getOwnPropertyDescriptor($,K):void 0},V0={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:s},I0=(Z=V0,$,K)=>{let{kind:X,metadata:Y}=K;if(uZ&&Y==null)dZ("missing-class-metadata",`The class ${$} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);let G=globalThis.litPropertyMetadata.get(Y);if(G===void 0)globalThis.litPropertyMetadata.set(Y,G=new Map);if(X==="setter")Z=Object.create(Z),Z.wrapped=!0;if(G.set(K.name,Z),X==="accessor"){let{name:Q}=K;return{set(J){let F=$.get.call(this);$.set.call(this,J),this.requestUpdate(Q,F,Z,!0,J)},init(J){if(J!==void 0)this._$changeProperty(Q,void 0,Z,J);return J}}}else if(X==="setter"){let{name:Q}=K;return function(J){let F=this[Q];$.call(this,J),this.requestUpdate(Q,F,Z,!0,J)}}throw Error(`Unsupported decorator location: ${X}`)};function i(Z){return($,K)=>{return typeof K==="object"?I0(Z,$,K):N0(Z,$,K)}}function N(Z){return i({...Z,state:!0,attribute:!1})}var L0=!0,D0;if(L0)globalThis.litIssuedWarnings??=new Set,D0=(Z,$)=>{if($+=Z?` See https://lit.dev/msg/${Z} for more information.`:"",!globalThis.litIssuedWarnings.has($)&&!globalThis.litIssuedWarnings.has(Z))console.warn($),globalThis.litIssuedWarnings.add($)};function kZ(Z){let $=new Date(Z),X=Date.now()-$.getTime(),Y=Math.floor(X/1000);if(Y<60)return"teraz";let G=Math.floor(Y/60);if(G<60)return`${G} min temu`;let Q=Math.floor(G/60);if(Q<24)return`${Q} godz. temu`;let J=Math.floor(Q/24);if(J<7)return`${J} dn. temu`;return $.toLocaleDateString("pl-PL",{day:"numeric",month:"short"})}class UZ extends C{constructor(){super(...arguments);this.mockId=0;this.entryFile="index.html";this.pagePath="";this.threads=[];this.authorName="";this.showAll=!1;this.hideResolved=!1;this.confirmDeleteId=null;this.activeCompose=null;this.openThreadId=null;this.namePromptMode=!1;this.submitting=!1;this.commentMode=!1}channel=null;iframe=null;overlay=null;panel=null;iframeWrapper=null;connectedCallback(){super.connectedCallback(),this.pagePath=this.entryFile,this.loadAuthorName(),this.initChannel(),requestAnimationFrame(()=>{this.attachExternalElements()})}initChannel(){let Z=window.well;if(!Z){setTimeout(()=>this.initChannel(),50);return}this.channel=Z.channel(`comments:${this.mockId}`),this.channel.on("join_ok",($)=>{if($&&$.threads)this.threads=$.threads,this.renderPins()}),this.channel.on("thread_created",($)=>{this.handleChannelEvent("thread_created",$)}),this.channel.on("comment_added",($)=>{this.handleChannelEvent("comment_added",$)}),this.channel.on("thread_resolved",($)=>{this.handleChannelEvent("thread_resolved",$)}),this.channel.on("thread_deleted",($)=>{this.handleChannelEvent("thread_deleted",$)})}disconnectedCallback(){if(super.disconnectedCallback(),this.channel)this.channel.leave(),this.channel=null;this.detachExternalListeners()}handleChannelEvent(Z,$){switch(Z){case"thread_created":{let K=$;if(!this.threads.some((X)=>X.id===K.id))this.threads=[K,...this.threads];this.renderPins();break}case"comment_added":{let K=$;this.threads=this.threads.map((X)=>X.id===K.thread_id?{...X,comments:X.comments.some((Y)=>Y.id===K.id)?X.comments:[...X.comments,K]}:X),this.renderPins();break}case"thread_resolved":{let K=$;this.threads=this.threads.map((X)=>X.id===K.id?K:X),this.renderPins();break}case"thread_deleted":{let K=$.thread_id;if(this.threads=this.threads.filter((X)=>X.id!==K),this.openThreadId===K)this.openThreadId=null;this.renderPins();break}}}loadAuthorName(){let Z=localStorage.getItem("smock_author");if(Z){try{let $=JSON.parse(Z);if(Date.now()-$.timestamp<86400000&&$.name){this.authorName=$.name,this.namePromptMode=!1;return}}catch($){}localStorage.removeItem("smock_author")}this.authorName="",this.namePromptMode=!0}saveAuthorName(Z){this.authorName=Z,this.namePromptMode=!1,localStorage.setItem("smock_author",JSON.stringify({name:Z,timestamp:Date.now()}))}changeName(){localStorage.removeItem("smock_author"),this.authorName="",this.namePromptMode=!0}_overlayClickHandler=null;_iframeLoadHandler=null;_scrollHandler=null;_resizeHandler=null;_keydownHandler=null;_pageSelectHandler=null;_homeHandler=null;attachExternalElements(){if(this.iframe=document.getElementById("mock-iframe"),this.overlay=document.getElementById("comment-overlay"),this.panel=this,this.iframeWrapper=document.getElementById("iframe-wrapper"),this.overlay)this._overlayClickHandler=(Y)=>this.handleOverlayClick(Y),this.overlay.addEventListener("click",this._overlayClickHandler);if(this.iframe)this._iframeLoadHandler=()=>{this.attachIframeScrollListener(),this.syncOverlay(),this.detectIframeNavigation()},this.iframe.addEventListener("load",this._iframeLoadHandler),this.attachIframeScrollListener(),this.syncOverlay();this._keydownHandler=(Y)=>{if(Y.key==="Escape")this.activeCompose=null,this.openThreadId=null},document.addEventListener("keydown",this._keydownHandler);let Z=document.getElementById("page-select");if(Z)this._pageSelectHandler=()=>{this.pagePath=Z.value,this.activeCompose=null,this.openThreadId=null,this.renderPins()},Z.addEventListener("change",this._pageSelectHandler);let $=document.getElementById("home-page-btn");if($)this._homeHandler=()=>{this.pagePath=this.entryFile,this.activeCompose=null,this.openThreadId=null;let Y=document.getElementById("page-select");if(Y)Y.value=this.entryFile;this.renderPins()},$.addEventListener("click",this._homeHandler);let K=document.getElementById("comment-toggle");if(K)K.addEventListener("click",()=>{let Y=this.style.display!=="none";if(this.style.display=Y?"none":"",this.overlay)this.overlay.style.display=Y?"none":"";if(K.classList.toggle("active",!Y),Y)this.activeCompose=null,this.openThreadId=null,this.setCommentMode(!1)});let X=document.getElementById("comment-mode-switch");if(X)X.querySelectorAll(".comment-mode-opt").forEach((Y)=>{Y.addEventListener("click",()=>{this.setCommentMode(Y.dataset.mode==="comment")})})}detachExternalListeners(){if(this.overlay&&this._overlayClickHandler)this.overlay.removeEventListener("click",this._overlayClickHandler);if(this.iframe&&this._iframeLoadHandler)this.iframe.removeEventListener("load",this._iframeLoadHandler);if(this._keydownHandler)document.removeEventListener("keydown",this._keydownHandler)}syncOverlay(){if(!this.iframe||!this.overlay)return;try{let Z=this.iframe.contentDocument;if(!Z||!Z.body)return;let $=Z.documentElement.scrollWidth,K=Z.documentElement.scrollHeight,X=Z.documentElement.scrollLeft||Z.body.scrollLeft,Y=Z.documentElement.scrollTop||Z.body.scrollTop;this.overlay.style.width=$+"px",this.overlay.style.height=K+"px",this.overlay.style.transform=`translate(${-X}px, ${-Y}px)`}catch(Z){this.overlay.style.width="",this.overlay.style.height="",this.overlay.style.transform=""}}attachIframeScrollListener(){try{let Z=this.iframe?.contentDocument;if(!Z)return;this._scrollHandler=()=>this.syncOverlay(),Z.addEventListener("scroll",this._scrollHandler),this._resizeHandler=()=>this.syncOverlay(),this.iframe?.contentWindow?.addEventListener("resize",this._resizeHandler),this.syncOverlay()}catch(Z){}}detectIframeNavigation(){try{let Z=this.iframe?.contentWindow?.location.pathname||"",K=document.getElementById("mock-viewer")?.dataset.baseUrl||"",X=new URL(K,window.location.origin).pathname;if(Z.startsWith(X)){let Y=Z.slice(X.length);if(Y&&Y!==this.pagePath){this.pagePath=Y;let G=document.getElementById("page-select");if(G)G.value=Y;this.activeCompose=null,this.openThreadId=null,this.renderPins()}}}catch(Z){}}setCommentMode(Z){if(this.commentMode=Z,this.overlay)this.overlay.classList.toggle("comment-mode",Z);let $=document.getElementById("comment-mode-switch");if($)$.querySelectorAll(".comment-mode-opt").forEach((K)=>{let X=K,Y=X.dataset.mode==="navigate";X.classList.toggle("active",Z?!Y:Y)});if(!Z)this.activeCompose=null,this.openThreadId=null,this.renderPins()}handleOverlayClick(Z){let $=Z.target;if($.classList.contains("comment-pin")||$.closest(".comment-bubble"))return;if(this.activeCompose||this.openThreadId){this.activeCompose=null,this.openThreadId=null,this.renderPins();return}let K=this.overlay.offsetWidth,X=this.overlay.offsetHeight,Y=this.overlay.getBoundingClientRect(),G=Z.clientX-Y.left,Q=Z.clientY-Y.top,J=G/K*100,F=Q/X*100;if(!this.authorName)this.namePromptMode=!0;this.activeCompose={x:J,y:F},this.openThreadId=null,this.renderPins()}handlePinClick(Z,$){$.stopPropagation(),this.openThreadId=Z,this.activeCompose=null,this.renderPins()}async createThread(Z){if(!this.activeCompose||!Z.trim()||this.submitting||!this.channel)return;this.submitting=!0,this.renderPins();try{let $=await this.channel.push("create_thread",{mock_id:this.mockId,page_path:this.pagePath,x_pct:this.activeCompose.x,y_pct:this.activeCompose.y,author_name:this.authorName,body:Z.trim()});if(!this.threads.some((K)=>K.id===$.id))this.threads=[$,...this.threads];this.activeCompose=null,this.openThreadId=$.id}catch($){console.error("[smock-comments] create_thread failed:",$)}finally{this.submitting=!1}}async addComment(Z,$){if(!$.trim()||this.submitting||!this.channel)return;this.submitting=!0,this.renderPins();try{let K=await this.channel.push("add_comment",{thread_id:Z,author_name:this.authorName,body:$.trim()});this.threads=this.threads.map((X)=>X.id===K.thread_id?{...X,comments:X.comments.some((Y)=>Y.id===K.id)?X.comments:[...X.comments,K]}:X)}catch(K){console.error("[smock-comments] add_comment failed:",K)}finally{this.submitting=!1}}async resolveThread(Z){if(!this.channel)return;try{let $=await this.channel.push("resolve_thread",{thread_id:Z});this.threads=this.threads.map((K)=>K.id===$.id?$:K),this.renderPins()}catch($){console.error("[smock-comments] resolve_thread failed:",$)}}async deleteThread(Z){if(this.confirmDeleteId!==Z){this.confirmDeleteId=Z;return}if(!this.channel)return;try{if(await this.channel.push("delete_thread",{thread_id:Z}),this.threads=this.threads.filter(($)=>$.id!==Z),this.confirmDeleteId=null,this.openThreadId===Z)this.openThreadId=null;this.renderPins()}catch($){console.error("[smock-comments] delete_thread failed:",$)}}renderPins(){if(!this.overlay)return;this.overlay.querySelectorAll(".comment-pin, .comment-bubble, .pin-tooltip").forEach((X)=>X.remove());let Z=this.threads.filter((X)=>X.page_path===this.pagePath),$=Z.filter((X)=>!X.resolved),K=Z.filter((X)=>X.resolved);if($.forEach((X,Y)=>{let G=document.createElement("div");G.className="comment-pin",G.style.left=X.x_pct+"%",G.style.top=X.y_pct+"%",G.textContent=String(Y+1),G.dataset.threadId=String(X.id),G.addEventListener("mouseenter",()=>{G.classList.add("pin-highlight"),this.highlightThreadInPanel(X.id,!0),this.showPinTooltip(G,X)}),G.addEventListener("mouseleave",()=>{G.classList.remove("pin-highlight"),this.highlightThreadInPanel(X.id,!1),this.hidePinTooltip()}),G.addEventListener("click",(Q)=>this.handlePinClick(X.id,Q)),this.overlay.appendChild(G)}),!this.hideResolved)K.forEach((X)=>{let Y=document.createElement("div");Y.className="comment-pin comment-pin-resolved",Y.style.left=X.x_pct+"%",Y.style.top=X.y_pct+"%",Y.textContent="✓",Y.dataset.threadId=String(X.id),Y.addEventListener("mouseenter",()=>{this.showPinTooltip(Y,X)}),Y.addEventListener("mouseleave",()=>{this.hidePinTooltip()}),Y.addEventListener("click",(G)=>this.handlePinClick(X.id,G)),this.overlay.appendChild(Y)});if(this.activeCompose){let X=document.createElement("div");X.className="comment-pin comment-pin-preview",X.textContent="•",X.style.left=this.activeCompose.x+"%",X.style.top=this.activeCompose.y+"%",this.overlay.appendChild(X),this.renderBubble(this.activeCompose.x,this.activeCompose.y,null)}if(this.openThreadId){let X=this.threads.find((Y)=>Y.id===this.openThreadId);if(X&&X.page_path===this.pagePath)this.renderBubble(X.x_pct,X.y_pct,X)}}showPinTooltip(Z,$){this.hidePinTooltip();let K=$.comments[0];if(!K)return;let X=document.createElement("div");X.className="pin-tooltip";let Y=K.body.length>60?K.body.substring(0,57)+"...":K.body;X.innerHTML=`<strong>${this.esc(K.author_name)}</strong>: ${this.esc(Y)}`,X.style.left=Z.style.left,X.style.top=Z.style.top,this.overlay.appendChild(X)}hidePinTooltip(){this.overlay?.querySelectorAll(".pin-tooltip").forEach((Z)=>Z.remove())}highlightThreadInPanel(Z,$){let K=this.shadowRoot?.querySelector(`.thread-item[data-thread-id="${Z}"]`);if(K)if($)K.classList.add("thread-highlight");else K.classList.remove("thread-highlight")}renderBubble(Z,$,K){if(!this.overlay)return;let X=document.createElement("div");if(X.className="comment-bubble",Z>65)X.classList.add("bubble-flip-left");if(X.style.left=Z+"%",X.style.top=$+"%",X.addEventListener("click",(G)=>G.stopPropagation()),this.namePromptMode){X.innerHTML=`
        <div class="bubble-name-prompt">
          <p>Podaj swoje imię</p>
          <div class="bubble-name-row">
            <input type="text" class="bubble-name-input" placeholder="Twoje imię..." />
            <button class="btn btn-primary bubble-name-btn">OK</button>
          </div>
        </div>
      `;let G=X.querySelector(".bubble-name-input"),Q=X.querySelector(".bubble-name-btn"),J=()=>{let F=G.value.trim();if(F)this.saveAuthorName(F),this.renderPins()};Q.addEventListener("click",J),G.addEventListener("keydown",(F)=>{if(F.key==="Enter")J()}),setTimeout(()=>G.focus(),0)}else if(K){let G=K.comments.map((H,D)=>`
        <div class="bubble-comment ${D===0?"bubble-comment-original":"bubble-comment-reply"}">
          <div class="bubble-comment-header">
            <strong>${this.esc(H.author_name)}</strong>
            <span class="bubble-comment-time">${kZ(H.created_at)}</span>
          </div>
          <p>${this.esc(H.body)}</p>
        </div>
      `).join(""),Q=this.submitting;X.innerHTML=`
        <div class="bubble-thread">
          <div class="bubble-comments">${G}</div>
          <div class="bubble-reply-form">
            <textarea class="bubble-textarea" placeholder="Odpowiedz..." rows="2" ${Q?"disabled":""}></textarea>
            <div class="bubble-reply-actions">
              <button class="btn btn-primary bubble-send-btn" ${Q?"disabled":""}>${Q?"Wysyłanie...":"Wyślij"}</button>
              <button class="bubble-cancel-compose-btn">Anuluj</button>
            </div>
          </div>
          <div class="bubble-actions">
            <button class="bubble-resolve-btn">${K.resolved?"Resolved":"Resolve"}</button>
            <button class="bubble-delete-btn">${this.confirmDeleteId===K.id?"Sure?":"Delete"}</button>
            ${this.confirmDeleteId===K.id?'<button class="bubble-cancel-btn">Cancel</button>':""}
          </div>
        </div>
      `;let J=X.querySelector(".bubble-textarea");X.querySelector(".bubble-send-btn").addEventListener("click",()=>{this.addComment(K.id,J.value),J.value=""}),J.addEventListener("keydown",(H)=>{if(H.key==="Enter"&&H.ctrlKey)this.addComment(K.id,J.value),J.value=""}),X.querySelector(".bubble-cancel-compose-btn").addEventListener("click",()=>{this.openThreadId=null,this.renderPins()}),X.querySelector(".bubble-resolve-btn").addEventListener("click",()=>this.resolveThread(K.id)),X.querySelector(".bubble-delete-btn").addEventListener("click",()=>this.deleteThread(K.id));let V=X.querySelector(".bubble-cancel-btn");if(V)V.addEventListener("click",()=>{this.confirmDeleteId=null,this.renderPins()})}else{let G=this.submitting;X.innerHTML=`
        <div class="bubble-compose">
          <textarea class="bubble-textarea" placeholder="Napisz komentarz..." rows="2" ${G?"disabled":""}></textarea>
          <div class="bubble-compose-actions">
            <button class="btn btn-primary bubble-send-btn" ${G?"disabled":""}>${G?"Wysyłanie...":"Wyślij"}</button>
            <button class="bubble-cancel-compose-btn">Anuluj</button>
          </div>
        </div>
      `;let Q=X.querySelector(".bubble-textarea");X.querySelector(".bubble-send-btn").addEventListener("click",()=>this.createThread(Q.value)),Q.addEventListener("keydown",(k)=>{if(k.key==="Enter"&&k.ctrlKey)this.createThread(Q.value)}),X.querySelector(".bubble-cancel-compose-btn").addEventListener("click",()=>{this.activeCompose=null,this.renderPins()}),setTimeout(()=>Q.focus(),0)}let Y=document.createElement("button");Y.className="bubble-close-btn",Y.textContent="×",Y.addEventListener("click",(G)=>{G.stopPropagation(),this.activeCompose=null,this.openThreadId=null,this.renderPins()}),X.appendChild(Y),this.overlay.appendChild(X)}esc(Z){let $=document.createElement("div");return $.textContent=Z,$.innerHTML}navigateToThread(Z){if(Z.page_path!==this.pagePath){this.pagePath=Z.page_path;let $=document.getElementById("page-select");if($)$.value=Z.page_path;let X=document.getElementById("mock-viewer")?.dataset.baseUrl||"";if(this.iframe)this.iframe.src=X+Z.page_path,this.iframe.addEventListener("load",()=>{this.syncOverlay(),setTimeout(()=>{this.scrollIframeToPin(Z.x_pct,Z.y_pct),this.openThreadId=Z.id,this.activeCompose=null,this.renderPins()},100)},{once:!0})}else this.scrollIframeToPin(Z.x_pct,Z.y_pct),this.openThreadId=Z.id,this.activeCompose=null,this.renderPins();setTimeout(()=>{let $=this.overlay?.querySelector(`.comment-pin[data-thread-id="${Z.id}"]`);if($)$.classList.add("pin-highlight"),setTimeout(()=>$.classList.remove("pin-highlight"),1500)},200)}scrollIframeToPin(Z,$){try{let K=this.iframe?.contentDocument;if(!K)return;let X=K.documentElement.scrollWidth,Y=K.documentElement.scrollHeight,G=this.iframe.clientWidth,Q=this.iframe.clientHeight,J=Z/100*X-G/2,F=$/100*Y-Q/2;K.documentElement.scrollTo({left:Math.max(0,J),top:Math.max(0,F),behavior:"smooth"})}catch(K){}}updated(){this.renderPins()}static styles=_Z`
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
  `;render(){let Z=this.showAll?this.threads:this.threads.filter((Q)=>Q.page_path===this.pagePath),$=Z.filter((Q)=>!Q.resolved),K=Z.filter((Q)=>Q.resolved),X=this.threads.filter((Q)=>Q.page_path===this.pagePath&&!Q.resolved),Y=new Map;X.forEach((Q,J)=>Y.set(Q.id,J+1));let G=(Q)=>{return[...new Set(Q.map((F)=>F.page_path))].map((F)=>({page:F,threads:Q.filter((k)=>k.page_path===F)}))};return T`
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
          ${this.showAll?G($).map((Q)=>T`
                <div class="comment-page-group">
                  <div class="page-group-header">${this.basename(Q.page)}</div>
                  ${Q.threads.map((J)=>this.renderThreadItem(J,Y.get(J.id)))}
                </div>
              `):$.map((Q)=>this.renderThreadItem(Q,Y.get(Q.id)))}
        </div>

        ${K.length>0&&!this.hideResolved?T`
          <div class="resolved-section">
            <h4>Resolved</h4>
            ${this.showAll?G(K).map((Q)=>T`
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
    `}renderThreadItem(Z,$){let K=Z.comments[0],X=Z.comments.length-1;return T`
      <div class="thread-item" data-thread-id=${Z.id}
        @click=${()=>this.navigateToThread(Z)}
        @mouseenter=${()=>this.highlightPin(Z.id,!0)}
        @mouseleave=${()=>this.highlightPin(Z.id,!1)}>
        <div class="thread-meta">
          ${$?T`<span class="thread-pin-num">${$}</span>`:B}
          <span class="thread-author">${K?.author_name||""}</span>
          <span class="thread-time">${K?kZ(K.created_at):""}</span>
          <span class="thread-page">${this.basename(Z.page_path)}</span>
        </div>
        <div class="thread-body">${K?.body||""}</div>
        ${X>0?T`<div class="thread-reply-count">${X} ${X===1?"odpowiedź":"odpowiedzi"}</div>`:B}
      </div>
    `}renderResolvedItem(Z){let $=Z.comments[0];return T`
      <div class="resolved-item">
        <strong>${$?.author_name||""}</strong>
        <span class="thread-time" style="margin-left: 8px; font-size: 11px;">${$?kZ($.created_at):""}</span>
        <p style="margin:2px 0 0">${$?.body||""}</p>
      </div>
    `}highlightPin(Z,$){let K=this.overlay?.querySelector(`.comment-pin[data-thread-id="${Z}"]`);if(K)if($)K.classList.add("pin-highlight");else K.classList.remove("pin-highlight")}basename(Z){let $=Z.split("/");return $[$.length-1]||Z}}U([i({type:Number,attribute:"mock-id"})],UZ.prototype,"mockId",void 0),U([i({type:String,attribute:"entry-file"})],UZ.prototype,"entryFile",void 0),U([N()],UZ.prototype,"pagePath",void 0),U([N()],UZ.prototype,"threads",void 0),U([N()],UZ.prototype,"authorName",void 0),U([N()],UZ.prototype,"showAll",void 0),U([N()],UZ.prototype,"hideResolved",void 0),U([N()],UZ.prototype,"confirmDeleteId",void 0),U([N()],UZ.prototype,"activeCompose",void 0),U([N()],UZ.prototype,"openThreadId",void 0),U([N()],UZ.prototype,"namePromptMode",void 0),U([N()],UZ.prototype,"submitting",void 0),U([N()],UZ.prototype,"commentMode",void 0),UZ=U([mZ("smock-comments")],UZ);export{UZ as SmockComments};
