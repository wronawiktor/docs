"use strict";(self.webpackChunkgo_4_clouds=self.webpackChunkgo_4_clouds||[]).push([[2168],{3905:(e,t,n)=>{n.d(t,{Zo:()=>i,kt:()=>m});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},i=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,s=e.parentName,i=o(e,["components","mdxType","originalType","parentName"]),u=c(n),k=l,m=u["".concat(s,".").concat(k)]||u[k]||d[k]||r;return n?a.createElement(m,p(p({ref:t},i),{},{components:n})):a.createElement(m,p({ref:t},i))}));function m(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,p=new Array(r);p[0]=k;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[u]="string"==typeof e?e:l,p[1]=o;for(var c=2;c<r;c++)p[c]=n[c];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},2841:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>p,default:()=>u,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var a=n(7462),l=(n(7294),n(3905));const r={sidebar_position:5},p="Basic Pods operations",o={unversionedId:"kubernetes/basic-pod-operations",id:"kubernetes/basic-pod-operations",title:"Basic Pods operations",description:"Basic operations with Pods",source:"@site/docs/kubernetes/basic-pod-operations.md",sourceDirName:"kubernetes",slug:"/kubernetes/basic-pod-operations",permalink:"/docs/kubernetes/basic-pod-operations",draft:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Install cluster extension",permalink:"/docs/kubernetes/install-plugins"},next:{title:"Advanced Pod operations",permalink:"/docs/kubernetes/advanced-pods"}},s={},c=[{value:"Check Pods status",id:"check-pods-status",level:2},{value:"Create a basic Pod application",id:"create-a-basic-pod-application",level:2},{value:"Generate a Pod template",id:"generate-a-pod-template",level:2}],i={toc:c};function u(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,a.Z)({},i,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"basic-pods-operations"},"Basic Pods operations"),(0,l.kt)("p",null,"Basic operations with Pods"),(0,l.kt)("h2",{id:"check-pods-status"},"Check Pods status"),(0,l.kt)("p",null,"Check the list of Namespaces:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get namespaces\nkubectl get ns\n")),(0,l.kt)("p",null,"List Pods in the ",(0,l.kt)("inlineCode",{parentName:"p"},"default")," Namespace:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods\n")),(0,l.kt)("p",null,"List Pods in the ",(0,l.kt)("inlineCode",{parentName:"p"},"kube-system")," Namespace:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods -n kube-system\nkubectl get pods -n kube-system -o wide\n")),(0,l.kt)("p",null,"List Pods in all Namespaces:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods -A\nkubectl get pods -A -o wide\n")),(0,l.kt)("p",null,"Check Pod details:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl describe pod -n kube-system kube-apiserver-cp1\n")),(0,l.kt)("h2",{id:"create-a-basic-pod-application"},"Create a basic Pod application"),(0,l.kt)("p",null,"Create the ",(0,l.kt)("inlineCode",{parentName:"p"},"app")," Namespace:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create ns app\n")),(0,l.kt)("p",null,"Create a basic Pod in the ",(0,l.kt)("inlineCode",{parentName:"p"},"app")," Namespace:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl run -n app app --image=nginx:1.23.3\n")),(0,l.kt)("p",null,"Check the Pod status and wait until the status changes to ",(0,l.kt)("inlineCode",{parentName:"p"},"Running"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pod -n app app -o wide -w\n")),(0,l.kt)("p",null,"Check logs of the ",(0,l.kt)("inlineCode",{parentName:"p"},"app")," Pod container;"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl logs -n app app\n")),(0,l.kt)("p",null,"Open the terminal to the ",(0,l.kt)("inlineCode",{parentName:"p"},"app")," Pod container:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl exec -n app -ti app -- sh\n# ls\n# exit\n")),(0,l.kt)("p",null,"Cleanup the ",(0,l.kt)("inlineCode",{parentName:"p"},"app")," Pod:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl delete pod -n app app\nkubectl delete ns app\n")),(0,l.kt)("h2",{id:"generate-a-pod-template"},"Generate a Pod template"),(0,l.kt)("p",null,"Create a new Namespace:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create ns frontend\nkubectl get ns\n")),(0,l.kt)("p",null,"Generate the ",(0,l.kt)("inlineCode",{parentName:"p"},"webapp")," Pod template:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl run webapp -n frontend --image=nginx:1.22 --dry-run=client -o yaml\n")),(0,l.kt)("p",null,"Save the Pod template as the ",(0,l.kt)("inlineCode",{parentName:"p"},"yaml")," manifest:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl run webapp -n frontend --image=nginx:1.22 --dry-run=client -o yaml > pod-webapp.yaml\n")),(0,l.kt)("p",null,"Apply the Pod manifest to a cluster:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl apply -f pod-webapp.yaml\n")),(0,l.kt)("p",null,"Verify the operation on the cluster:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods -n frontend -o wide\n")),(0,l.kt)("p",null,"Get logs from ",(0,l.kt)("inlineCode",{parentName:"p"},"webapp")," Pod container:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl logs -n frontend webapp\n")),(0,l.kt)("p",null,"Cleanup the environment "),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl delete namespace frontend\n")))}u.isMDXComponent=!0}}]);