"use strict";(self.webpackChunkgo_4_clouds=self.webpackChunkgo_4_clouds||[]).push([[521],{3905:(e,n,t)=>{t.d(n,{Zo:()=>o,kt:()=>d});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=a.createContext({}),c=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):p(p({},n),e)),t},o=function(e){var n=c(e.components);return a.createElement(i.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},k=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,o=s(e,["components","mdxType","originalType","parentName"]),u=c(t),k=r,d=u["".concat(i,".").concat(k)]||u[k]||m[k]||l;return t?a.createElement(d,p(p({ref:n},o),{},{components:t})):a.createElement(d,p({ref:n},o))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,p=new Array(l);p[0]=k;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s[u]="string"==typeof e?e:r,p[1]=s;for(var c=2;c<l;c++)p[c]=t[c];return a.createElement.apply(null,p)}return a.createElement.apply(null,t)}k.displayName="MDXCreateElement"},1413:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>p,default:()=>u,frontMatter:()=>l,metadata:()=>s,toc:()=>c});var a=t(7462),r=(t(7294),t(3905));const l={sidebar_position:11},p="Security concept",s={unversionedId:"kubernetes/security-rbac",id:"kubernetes/security-rbac",title:"Security concept",description:"Learn basic about Kubernetes security",source:"@site/docs/kubernetes/security-rbac.md",sourceDirName:"kubernetes",slug:"/kubernetes/security-rbac",permalink:"/docs/kubernetes/security-rbac",draft:!1,tags:[],version:"current",sidebarPosition:11,frontMatter:{sidebar_position:11},sidebar:"tutorialSidebar",previous:{title:"Using Service concept",permalink:"/docs/kubernetes/service-concept"},next:{title:"Use an Ingress Controller",permalink:"/docs/kubernetes/ingress-controller"}},i={},c=[{value:"Understand client certificates",id:"understand-client-certificates",level:2},{value:"Create ServiceAccount and RBAC role",id:"create-serviceaccount-and-rbac-role",level:2}],o={toc:c};function u(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},o,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"security-concept"},"Security concept"),(0,r.kt)("p",null,"Learn basic about Kubernetes security"),(0,r.kt)("h2",{id:"understand-client-certificates"},"Understand client certificates"),(0,r.kt)("p",null,"View ",(0,r.kt)("inlineCode",{parentName:"p"},"kubernetes-admin")," user ",(0,r.kt)("strong",{parentName:"p"},"KUBECONFIG"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl config view\n")),(0,r.kt)("p",null,"Get ",(0,r.kt)("inlineCode",{parentName:"p"},"client-certificate-data")," from ",(0,r.kt)("inlineCode",{parentName:"p"},"./kube/config")," file and decode it with ",(0,r.kt)("inlineCode",{parentName:"p"},"base64")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"awk '/client-certificate-data/ {print $2}' $HOME/.kube/config | base64 -d\n")),(0,r.kt)("p",null,"Now we can check client certificate details using ",(0,r.kt)("strong",{parentName:"p"},"OpenSSL"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"awk '/client-certificate-data/ {print $2}' $HOME/.kube/config | base64 -d | openssl x509 -noout -text\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number: 1752237598914016353 (0x185132cffd5a7461)\n        Signature Algorithm: sha256WithRSAEncryption\n        Issuer: CN = kubernetes\n        Validity\n            Not Before: Feb 27 17:38:48 2023 GMT\n            Not After : Feb 27 17:38:51 2024 GMT\n        Subject: O = system:masters, CN = kubernetes-admin\n        ...\n")),(0,r.kt)("p",null,"Organization / O field in Subject ",(0,r.kt)("inlineCode",{parentName:"p"},"O = system:masters")," is Kubernetes Group name.\nCommon Name / CN field in Subject ",(0,r.kt)("inlineCode",{parentName:"p"},"CN = kubernetes-admin")," is Kubernetes User name."),(0,r.kt)("p",null,"Now we can look on Kubernetes configuration ClusterRoleBinding or just RoleBinding with our User or Group Name:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get clusterrolebindings.rbac.authorization.k8s.io -o yaml | grep kubernetes-admin\nkubectl get clusterrolebindings.rbac.authorization.k8s.io -o yaml | grep system:masters\n")),(0,r.kt)("p",null,"At least for ",(0,r.kt)("inlineCode",{parentName:"p"},"system:masters")," it has to be some finding. Open ClusterRoleBindings details with ",(0,r.kt)("inlineCode",{parentName:"p"},"less"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get clusterrolebindings.rbac.authorization.k8s.io -o yaml | less\n")),(0,r.kt)("p",null,"View details for ",(0,r.kt)("inlineCode",{parentName:"p"},"cluster-admin")," ClusterRoleBinding name:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get clusterrolebindings.rbac.authorization.k8s.io cluster-admin -o yaml\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  labels:\n    kubernetes.io/bootstrapping: rbac-defaults\n  name: cluster-admin\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: cluster-admin\nsubjects:\n- apiGroup: rbac.authorization.k8s.io\n  kind: Group\n  name: system:masters\n")),(0,r.kt)("p",null,"Now we can look on ClusterRole which was assigned to Group ",(0,r.kt)("inlineCode",{parentName:"p"},"system:masters"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get clusterrole cluster-admin -o yaml\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  annotations:\n    rbac.authorization.kubernetes.io/autoupdate: \"true\"\n  labels:\n    kubernetes.io/bootstrapping: rbac-defaults\n  name: cluster-admin\nrules:\n- apiGroups:\n  - '*'\n  resources:\n  - '*'\n  verbs:\n  - '*'\n- nonResourceURLs:\n  - '*'\n  verbs:\n  - '*'\n")),(0,r.kt)("h2",{id:"create-serviceaccount-and-rbac-role"},"Create ServiceAccount and RBAC role"),(0,r.kt)("p",null,"Create new Namespace:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create ns webapp\n")),(0,r.kt)("p",null,"Create new ServiceAccount inside this Namespace:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create serviceaccount -n webapp webapp\n")),(0,r.kt)("p",null,"Check permission for ",(0,r.kt)("inlineCode",{parentName:"p"},"webapp")," ServiceAccount:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp get pods\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"no\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp delete pods\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"no\n")),(0,r.kt)("p",null,"Let's create new Role with basic permission to Pods:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="role-webapp.yaml"',title:'"role-webapp.yaml"'},'apiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: webapp\n  namespace: webapp\nrules:\n- apiGroups: [""]\n  resources: ["pods"]\n  verbs: ["list", "get", "watch"]\n')),(0,r.kt)("p",null,"Apply manifest with configuration:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl apply -f role-webapp.yaml\n")),(0,r.kt)("p",null,"Assign ",(0,r.kt)("inlineCode",{parentName:"p"},"webapp")," Role to ",(0,r.kt)("inlineCode",{parentName:"p"},"webapp")," ServiceAccount:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create rolebinding -n webapp webapp --role=webapp --serviceaccount=webapp:webapp --dry-run -o yaml > rolebinding-webapp.yaml\n")),(0,r.kt)("p",null,"This RoleBinding should looks like:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="rolebinding-webapp.yaml"',title:'"rolebinding-webapp.yaml"'},"apiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  creationTimestamp: null\n  name: webapp\n  namespace: webapp\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: Role\n  name: webapp\nsubjects:\n- kind: ServiceAccount\n  name: webapp\n  namespace: webapp\n")),(0,r.kt)("p",null,"Apply this RoleBinding configuration:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl apply -f rolebinding-webapp.yaml\n")),(0,r.kt)("p",null,"Let's test again privileges for ",(0,r.kt)("inlineCode",{parentName:"p"},"webapp")," ServiceAccount:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp get pods\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"yes\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp watch pods\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"yes\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl auth can-i -n webapp --as=system:serviceaccount:webapp:webapp create pods\n")),(0,r.kt)("p",null,"Output:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"no\n")),(0,r.kt)("p",null,"Create application Deployment with ServiceAccount:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="deploy-webapp.yaml"',title:'"deploy-webapp.yaml"'},"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: webapp\n  namespace: webapp\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: webapp\n  template:\n    metadata:\n      labels:\n        app: webapp\n    spec:\n      serviceAccount: webapp\n      containers:\n      - image: nginx:1.23.0-alpine\n        name: nginx\n")),(0,r.kt)("p",null,"Apply ",(0,r.kt)("inlineCode",{parentName:"p"},"deploy-webapp.yaml")," manifest:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl apply -f deploy-webapp.yaml\n")),(0,r.kt)("p",null,"Check Deployment, ReplicaSet and Pods statuses:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get deploy,rs,po -n webapp\n")),(0,r.kt)("p",null,"Open terminal session to any ",(0,r.kt)("inlineCode",{parentName:"p"},"webaapp")," Pod instance:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl exec -n webapp -ti webapp-<Tab> -- sh\n")),(0,r.kt)("p",null,"Inside opened terminall execute following commands:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'# List /var/run/secrets/kubernetes.io/serviceaccount directory\nls /var/run/secrets/kubernetes.io/serviceaccount\n# Point to the internal API server hostname\nAPISERVER=https://kubernetes.default.svc\n# Path to ServiceAccount token\nSERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount\n# Read this Pod\'s namespace\nNAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)\n# Read the ServiceAccount bearer token\nTOKEN=$(cat ${SERVICEACCOUNT}/token)\n# Reference the internal certificate authority (CA)\nCACERT=${SERVICEACCOUNT}/ca.crt\n\ncurl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/namespaces/webapp/pods\n')))}u.isMDXComponent=!0}}]);