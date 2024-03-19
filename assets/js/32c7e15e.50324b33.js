"use strict";(self.webpackChunkgo_4_clouds=self.webpackChunkgo_4_clouds||[]).push([[6838],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var l=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,l,a=function(e,t){if(null==e)return{};var n,l,a={},r=Object.keys(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=l.createContext({}),c=function(e){var t=l.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return l.createElement(s.Provider,{value:t},e.children)},i="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},k=l.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),i=c(n),k=a,m=i["".concat(s,".").concat(k)]||i[k]||d[k]||r;return n?l.createElement(m,o(o({ref:t},u),{},{components:n})):l.createElement(m,o({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=k;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p[i]="string"==typeof e?e:a,o[1]=p;for(var c=2;c<r;c++)o[c]=n[c];return l.createElement.apply(null,o)}return l.createElement.apply(null,n)}k.displayName="MDXCreateElement"},2787:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>i,frontMatter:()=>r,metadata:()=>p,toc:()=>c});var l=n(7462),a=(n(7294),n(3905));const r={sidebar_position:10},o="Using Service concept",p={unversionedId:"kubernetes/service-concept",id:"kubernetes/service-concept",title:"Using Service concept",description:"Exposing Kubernetes application",source:"@site/docs/kubernetes/service-concept.md",sourceDirName:"kubernetes",slug:"/kubernetes/service-concept",permalink:"/docs/kubernetes/service-concept",draft:!1,tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"tutorialSidebar",previous:{title:"Create Persistent Volume",permalink:"/docs/kubernetes/persistent-volume"},next:{title:"Security concept",permalink:"/docs/kubernetes/security-rbac"}},s={},c=[{value:"Expose application Deployment",id:"expose-application-deployment",level:2},{value:"Use Port Forward to access Service applications",id:"use-port-forward-to-access-service-applications",level:2},{value:"Using kubectl proxy",id:"using-kubectl-proxy",level:2}],u={toc:c};function i(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,l.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"using-service-concept"},"Using Service concept"),(0,a.kt)("p",null,"Exposing Kubernetes application"),(0,a.kt)("h2",{id:"expose-application-deployment"},"Expose application Deployment"),(0,a.kt)("p",null,"Create new namespace:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create namespace frontend\n")),(0,a.kt)("p",null,"Deploy example frontend application:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create deployment web --image=nginx:1.23 -n frontend\n")),(0,a.kt)("p",null,"Check deployment status:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get deploy,rs,pods -n frontend -o wide\n")),(0,a.kt)("p",null,"Scale up application to 3 replicas:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl scale deployment -n frontend web --replicas=3\n")),(0,a.kt)("p",null,"Expose application Deployment with Service:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl expose deployment -n frontend web --type=ClusterIP --port=8080 --target-port=80\n")),(0,a.kt)("p",null,"Check Service status:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get svc -n frontend web\n")),(0,a.kt)("p",null,"Open tunnel connection to application Service:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl port-forward -n frontend svc/web 8080:8080 &\n")),(0,a.kt)("p",null,"Try to connect application on localhost:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"curl http://127.0.0.1:8080\n")),(0,a.kt)("p",null,"Try to connect application from cluster nodes:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"for SRV in cp1 worker{1,2,3}; do\nsudo ssh $SRV curl http://<ClusterIP>:8080;\ndone\n")),(0,a.kt)("p",null,"Display Service Endpoints:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get endpoints -n frontend web\n")),(0,a.kt)("p",null,"Scale up application once again to 5 replicas:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl scale deployment -n frontend web --replicas=5\n")),(0,a.kt)("p",null,"Check list of Endpoints: "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get endpoints -n frontend web\n")),(0,a.kt)("p",null,"Show Deployment properties for web application:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get deploy,rs,pods -n frontend -o wide\n")),(0,a.kt)("p",null,"Show deployment Pods labels:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods -n frontend --show-labels\n")),(0,a.kt)("p",null,"Output:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"NAME                  READY   STATUS    RESTARTS   AGE     LABELS\nweb-96d5df5c8-7qqlb   1/1     Running   0          17s     app=web,pod-template-hash=96d5df5c8\nweb-96d5df5c8-b9kng   1/1     Running   0          6m42s   app=web,pod-template-hash=96d5df5c8\nweb-96d5df5c8-hwk9z   1/1     Running   0          17s     app=web,pod-template-hash=96d5df5c8\nweb-96d5df5c8-pzclb   1/1     Running   0          11m     app=web,pod-template-hash=96d5df5c8\nweb-96d5df5c8-qr26w   1/1     Running   0          6m42s   app=web,pod-template-hash=96d5df5c8\n")),(0,a.kt)("p",null,"Remove Label ",(0,a.kt)("inlineCode",{parentName:"p"},"app=web")," from any Pod instance:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl label pod -n frontend web-<Tab>-<Tab> app-\n")),(0,a.kt)("p",null,"Check once again list of Pods:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods -n frontend --show-labels\n")),(0,a.kt)("p",null,"List pods only with label ",(0,a.kt)("inlineCode",{parentName:"p"},"app=web"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'kubectl get pods -n frontend --selector="app=web" -o wide\n')),(0,a.kt)("p",null,"Remove Service object:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl delete service -n frontend web\n")),(0,a.kt)("p",null,"Create once again deployment service but with NodePort:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl expose deployment -n frontend web --type=NodePort --port=80\n")),(0,a.kt)("p",null,"Check Service status:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get svc -n frontend web\n")),(0,a.kt)("p",null,"Output::"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"NAME   TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE\nweb    NodePort   10.96.208.39   <none>        80:30237/TCP   10s\n")),(0,a.kt)("p",null,"Use ",(0,a.kt)("inlineCode",{parentName:"p"},"ClusterIP")," to connect to service from outside cluster:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'NODEPORT=`kubectl get svc -n frontend web -o jsonpath="{.spec.ports[0].nodePort}"`\necho "NodePort for web service is $NODEPORT"\ncurl http://cp1:$NODEPORT\n')),(0,a.kt)("p",null,"or on all nodes"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'NODEPORT=`kubectl get svc -n frontend web -o jsonpath="{.spec.ports[0].nodePort}"`\nfor SRV in cp1 worker{1,2,3}; do\nsudo curl http://$SRV:$NODEPORT;\ndone\n')),(0,a.kt)("p",null,"Let's clean up:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl delete namespace frontend\n")),(0,a.kt)("h2",{id:"use-port-forward-to-access-service-applications"},"Use Port Forward to access Service applications"),(0,a.kt)("p",null,"This task is based on documentation ",(0,a.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#creating-mongodb-deployment-and-service"},"example")),(0,a.kt)("p",null,"Create Namespace for database:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl create namespace database\n")),(0,a.kt)("p",null,"Create a Deployment that runs MongoDB:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="mongo-deployment.yaml"',title:'"mongo-deployment.yaml"'},"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  labels:\n    app: mongo\n  name: mongo\n  namespace: database\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: mongo\n  template:\n    metadata:\n      labels:\n        app: mongo\n    spec:\n      containers:\n      - image: mongo\n        name: mongo\n        ports:\n        - name: mongodbport\n          containerPort: 27017\n          protocol: TCP\n")),(0,a.kt)("p",null,"Apply Kubernetes YAML manifest:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl apply -f mongo-deployment.yaml\n")),(0,a.kt)("p",null,"View the pod status to check that it is ready:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get pods -n database\n")),(0,a.kt)("p",null,"View the Deployment's status:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get deploy,rs,pods -n database -o wide\n")),(0,a.kt)("p",null,"Create a Service to expose MongoDB:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl expose -n database deployment mongo --type=ClusterIP --port=27017\n")),(0,a.kt)("p",null,"Check the Service created:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get service mongo -n database\n")),(0,a.kt)("p",null,"Output:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE\nmongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s\n")),(0,a.kt)("p",null,"Verify that the MongoDB server is running in the Pod, and listening on port 27017:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl get -n database pod mongo-<Tab> --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{\"\\n\"}}'\n")),(0,a.kt)("p",null,"The output displays the port for MongoDB in that Pod:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"27017\n")),(0,a.kt)("p",null,"Forward a local port to a port on the Pod:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl port-forward -n database pod/mongo-<Tab> 28015:27017 &\n")),(0,a.kt)("p",null,"or"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl port-forward -n database deployment/mongo 28015:27017 &\n")),(0,a.kt)("p",null,"or"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl port-forward -n database replicaset/mongo-<Tab> 28015:27017 &\n")),(0,a.kt)("p",null,"or"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl port-forward -n database service/mongo 28015:27017 &\n")),(0,a.kt)("p",null,"Any of the above commands works. The output is similar to this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"Forwarding from 127.0.0.1:28015 -> 27017\nForwarding from [::1]:28015 -> 27017\n")),(0,a.kt)("p",null,"Note: kubectl port-forward does not return. To continue with the exercises, you will need to open another terminal."),(0,a.kt)("p",null,"Install mongodb client package"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"sudo apt-get install mongodb-clients -y\n")),(0,a.kt)("p",null,"Start the MongoDB command line interface:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"mongo --port 28015\n")),(0,a.kt)("p",null,"At the MongoDB command line prompt, enter the ping command:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"db.runCommand( { ping: 1 } )\n")),(0,a.kt)("p",null,"A successful ping request returns:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"{ ok: 1 }\n")),(0,a.kt)("p",null,"Optionally let kubectl choose the local port\nIf you don't need a specific local port, you can let kubectl choose and allocate the local port and thus relieve you from having to manage local port conflicts, with the slightly simpler syntax:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl port-forward -n database deployment/mongo :27017 &\n")),(0,a.kt)("p",null,"The kubectl tool finds a local port number that is not in use (avoiding low ports numbers, because these might be used by other applications). The output is similar to:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"Forwarding from 127.0.0.1:63753 -> 27017\nForwarding from [::1]:63753 -> 27017\n")),(0,a.kt)("h2",{id:"using-kubectl-proxy"},"Using kubectl proxy"),(0,a.kt)("p",null,"This task is based on documentation ",(0,a.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#using-kubectl-proxy"},"example")),(0,a.kt)("p",null,"The following command runs kubectl in a mode where it acts as a reverse proxy. It handles locating the apiserver and authenticating. Run it like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"kubectl proxy --port=8080\n")),(0,a.kt)("p",null,"See kubectl proxy for more details."),(0,a.kt)("p",null,"Then you can explore the API with curl, wget, or a browser, replacing localhost with ","[::1]"," for IPv6, like so:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"curl http://localhost:8080/api/\n")),(0,a.kt)("p",null,"The output is similar to this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'{\n  "kind": "APIVersions",\n  "versions": [\n    "v1"\n  ],\n  "serverAddressByClientCIDRs": [\n    {\n      "clientCIDR": "0.0.0.0/0",\n      "serverAddress": "10.0.1.149:443"\n    }\n  ]\n}\n')),(0,a.kt)("p",null,"Without kubectl proxy"),(0,a.kt)("p",null,"Use kubectl describe secret... to get the token for the default service account with grep/cut:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")\nSECRET_NAME=$(kubectl get secrets | grep ^default | cut -f1 -d \' \')\nTOKEN=$(kubectl describe secret $SECRET_NAME | grep -E \'^token\' | cut -f2 -d\':\' | tr -d " ")\n\ncurl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure\n')),(0,a.kt)("p",null,"The output is similar to this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'{\n  "kind": "APIVersions",\n  "versions": [\n    "v1"\n  ],\n  "serverAddressByClientCIDRs": [\n    {\n      "clientCIDR": "0.0.0.0/0",\n      "serverAddress": "10.0.1.149:443"\n    }\n  ]\n}\n')))}i.isMDXComponent=!0}}]);