const AgonesSDK = require("@google-cloud/agones-sdk");

(async () => {
  const sdk = new AgonesSDK();
  await sdk.connect();

  // watching twice, state change, then exit causes crashes sidecar consistently, everything here seems to be necessary
  sdk.watchGameServer(
    () => {},
    () => {}
  );

  sdk.watchGameServer(
    () => {},
    () => {}
  );

  await sdk.ready();

  process.exit(0);
})();

/**

$ go run cmd/sdk-server/main.go --gameserver-name local-testing-gameserver --pod-namespace servers --kubeconfig "$HOME/.kube/config"

{"ctlConf":{"GameServerName":"local-testing-gameserver","PodNamespace":"servers","Address":"localhost","IsLocal":false,"LocalFile":"","Delay":0,"Timeout":0,"Test":"","TestSdkName":"","KubeConfig":"/Users/qhyun/.kube/config","GracefulTermination":true,"GRPCPort":9357,"HTTPPort":9358},"featureGates":"CountsAndLists=false\u0026DisableResyncOnSDKServer=false\u0026Example=false\u0026FleetAllocationOverflow=true\u0026GKEAutopilotExtendedDurationPods=false\u0026PlayerAllocationFilter=false\u0026PlayerTracking=false","message":"Starting sdk sidecar","severity":"info","source":"main","time":"2024-02-13T18:29:15.625688-05:00","version":"dev"}
{"error":"unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","message":"Error creating inClusterConfig, trying to build config from flagsunable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined","severity":"warning","source":"main","time":"2024-02-13T18:29:15.625943-05:00"}
{"gsKey":"servers/local-testing-gameserver","message":"Created GameServer sidecar","severity":"info","source":"*sdkserver.SDKServer","time":"2024-02-13T18:29:15.627499-05:00"}
{"gsKey":"servers/local-testing-gameserver","message":"Connection to Kubernetes service established","severity":"info","source":"*sdkserver.SDKServer","time":"2024-02-13T18:29:16.339715-05:00","try":0}
{"grpcEndpoint":"localhost:9357","message":"Starting SDKServer grpc service...","severity":"info","source":"main","time":"2024-02-13T18:29:16.3426-05:00"}
{"httpEndpoint":"localhost:9358","message":"Starting SDKServer grpc-gateway...","severity":"info","source":"main","time":"2024-02-13T18:29:16.354419-05:00"}
{"gsKey":"servers/local-testing-gameserver","message":"Starting workers...","queue":"agones.dev.servers.local-testing-gameserver","severity":"info","source":"*sdkserver.SDKServer","time":"2024-02-13T18:29:16.441736-05:00","workers":1}
{"error":"context canceled","gsKey":"servers/local-testing-gameserver","message":"stream closed with error","severity":"error","source":"*sdkserver.SDKServer","time":"2024-02-13T18:29:17.790606-05:00"}
E0213 18:29:17.790744   14686 runtime.go:79] Observed a panic: runtime.boundsError{x:2, y:1, signed:true, code:0x3} (runtime error: slice bounds out of range [2:1])
goroutine 9 [running]:
k8s.io/apimachinery/pkg/util/runtime.logPanic({0x105e8eb00?, 0x1400091fab8})
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/runtime/runtime.go:75 +0x7c
k8s.io/apimachinery/pkg/util/runtime.HandleCrash({0x0, 0x0, 0x1400017e2c0?})
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/runtime/runtime.go:49 +0x78
panic({0x105e8eb00?, 0x1400091fab8?})
        /usr/local/go/src/runtime/panic.go:914 +0x218
agones.dev/agones/pkg/sdkserver.(*SDKServer).sendGameServerUpdate(0x1400017e1e0, 0x14000763080)
        /Users/qhyun/git/agones/pkg/sdkserver/sdkserver.go:1262 +0x60c
agones.dev/agones/pkg/sdkserver.NewSDKServer.func2({0x14000032660?, 0x14000a0de18?}, {0x105fb2040?, 0x14000763080?})
        /Users/qhyun/git/agones/pkg/sdkserver/sdkserver.go:189 +0x3c
k8s.io/client-go/tools/cache.ResourceEventHandlerFuncs.OnUpdate(...)
        /Users/qhyun/git/agones/vendor/k8s.io/client-go/tools/cache/controller.go:250
k8s.io/client-go/tools/cache.(*processorListener).run.func1()
        /Users/qhyun/git/agones/vendor/k8s.io/client-go/tools/cache/shared_informer.go:971 +0xf8
k8s.io/apimachinery/pkg/util/wait.BackoffUntil.func1(0x0?)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:226 +0x40
k8s.io/apimachinery/pkg/util/wait.BackoffUntil(0x140009f0728?, {0x105fccc00, 0x14000339200}, 0x1, 0x1400021cd80)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:227 +0x90
k8s.io/apimachinery/pkg/util/wait.JitterUntil(0x0?, 0x3b9aca00, 0x0, 0x0?, 0x0?)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:204 +0x80
k8s.io/apimachinery/pkg/util/wait.Until(...)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:161
k8s.io/client-go/tools/cache.(*processorListener).run(0x1400088d320)
        /Users/qhyun/git/agones/vendor/k8s.io/client-go/tools/cache/shared_informer.go:967 +0x68
k8s.io/apimachinery/pkg/util/wait.(*Group).Start.func1()
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/wait.go:72 +0x58
created by k8s.io/apimachinery/pkg/util/wait.(*Group).Start in goroutine 57
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/wait.go:70 +0x7c
panic: runtime error: slice bounds out of range [2:1] [recovered]
        panic: runtime error: slice bounds out of range [2:1]

goroutine 9 [running]:
k8s.io/apimachinery/pkg/util/runtime.HandleCrash({0x0, 0x0, 0x1400017e2c0?})
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/runtime/runtime.go:56 +0xe0
panic({0x105e8eb00?, 0x1400091fab8?})
        /usr/local/go/src/runtime/panic.go:914 +0x218
agones.dev/agones/pkg/sdkserver.(*SDKServer).sendGameServerUpdate(0x1400017e1e0, 0x14000763080)
        /Users/qhyun/git/agones/pkg/sdkserver/sdkserver.go:1262 +0x60c
agones.dev/agones/pkg/sdkserver.NewSDKServer.func2({0x14000032660?, 0x14000a0de18?}, {0x105fb2040?, 0x14000763080?})
        /Users/qhyun/git/agones/pkg/sdkserver/sdkserver.go:189 +0x3c
k8s.io/client-go/tools/cache.ResourceEventHandlerFuncs.OnUpdate(...)
        /Users/qhyun/git/agones/vendor/k8s.io/client-go/tools/cache/controller.go:250
k8s.io/client-go/tools/cache.(*processorListener).run.func1()
        /Users/qhyun/git/agones/vendor/k8s.io/client-go/tools/cache/shared_informer.go:971 +0xf8
k8s.io/apimachinery/pkg/util/wait.BackoffUntil.func1(0x0?)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:226 +0x40
k8s.io/apimachinery/pkg/util/wait.BackoffUntil(0x140009f0728?, {0x105fccc00, 0x14000339200}, 0x1, 0x1400021cd80)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:227 +0x90
k8s.io/apimachinery/pkg/util/wait.JitterUntil(0x0?, 0x3b9aca00, 0x0, 0x0?, 0x0?)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:204 +0x80
k8s.io/apimachinery/pkg/util/wait.Until(...)
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/backoff.go:161
k8s.io/client-go/tools/cache.(*processorListener).run(0x1400088d320)
        /Users/qhyun/git/agones/vendor/k8s.io/client-go/tools/cache/shared_informer.go:967 +0x68
k8s.io/apimachinery/pkg/util/wait.(*Group).Start.func1()
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/wait.go:72 +0x58
created by k8s.io/apimachinery/pkg/util/wait.(*Group).Start in goroutine 57
        /Users/qhyun/git/agones/vendor/k8s.io/apimachinery/pkg/util/wait/wait.go:70 +0x7c
exit status 2

 */
