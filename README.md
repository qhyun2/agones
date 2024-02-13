bug reproduction

prereqs: nodejs and go installed

1. cd qhyun-reproduction
2. npm install

3. run the sdk server as an out of cluster dev server. running --local does not seem to cause crashes
   https://agones.dev/site/docs/advanced/out-of-cluster-dev-server
   eg. `go run ../cmd/sdk-server/main.go --gameserver-name local-testing-gameserver --pod-namespace servers --kubeconfig "$HOME/.kube/config"`

4. node watch.js
