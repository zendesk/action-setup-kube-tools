/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

var __createBinding = (undefined && undefined.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (undefined && undefined.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (undefined && undefined.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const fs = __importStar(require("fs"));
const toolCache = __importStar(require("@actions/tool-cache"));
const core = __importStar(require("@actions/core"));
const defaultProcessorArchType = 'amd64';
const defaultKubectlVersion = '1.24.10';
const defaultKustomizeVersion = '5.0.0';
const defaultHelmVersion = '3.11.1';
const defaultKubevalVersion = '0.16.1';
const defaultKubeconformVersion = '0.5.0';
const defaultConftestVersion = '0.39.0';
const defaultYqVersion = '4.30.7';
const defaultRancherVersion = '2.7.0';
const defaultTiltVersion = '0.31.2';
const defaultSkaffoldVersion = '2.1.0';
const defaultKubeScoreVersion = '1.16.1';
const Tools = [
    {
        name: 'kubectl',
        defaultVersion: defaultKubectlVersion,
        isArchived: false,
        supportArm: true,
        commandPathInPackage: 'kubectl'
    },
    {
        name: 'kustomize',
        defaultVersion: defaultKustomizeVersion,
        isArchived: true,
        supportArm: true,
        commandPathInPackage: 'kustomize'
    },
    {
        name: 'helm',
        defaultVersion: defaultHelmVersion,
        isArchived: true,
        supportArm: true,
        commandPathInPackage: 'linux-{arch}/helm'
    },
    {
        name: 'kubeval',
        defaultVersion: defaultKubevalVersion,
        isArchived: true,
        supportArm: false,
        commandPathInPackage: 'kubeval'
    },
    {
        name: 'kubeconform',
        defaultVersion: defaultKubeconformVersion,
        isArchived: true,
        supportArm: true,
        commandPathInPackage: 'kubeconform'
    },
    {
        name: 'conftest',
        defaultVersion: defaultConftestVersion,
        isArchived: true,
        supportArm: true,
        commandPathInPackage: 'conftest'
    },
    {
        name: 'yq',
        defaultVersion: defaultYqVersion,
        isArchived: false,
        supportArm: true,
        commandPathInPackage: 'yq_linux_{arch}'
    },
    {
        name: 'rancher',
        defaultVersion: defaultRancherVersion,
        isArchived: true,
        supportArm: true,
        commandPathInPackage: 'rancher-v{ver}/rancher'
    },
    {
        name: 'tilt',
        defaultVersion: defaultTiltVersion,
        isArchived: true,
        supportArm: true,
        commandPathInPackage: 'tilt'
    },
    {
        name: 'skaffold',
        defaultVersion: defaultSkaffoldVersion,
        isArchived: false,
        supportArm: true,
        commandPathInPackage: 'skaffold-linux-{arch}'
    },
    {
        name: 'kube-score',
        defaultVersion: defaultKubeScoreVersion,
        isArchived: false,
        supportArm: true,
        commandPathInPackage: 'kube-score'
    }
];
// Replace all {ver} and {arch} placeholders in the source format string with the actual values
function replacePlaceholders(format, version, archType) {
    return format.replace(/{ver}|{arch}/g, match => {
        return match === '{ver}' ? version : archType;
    });
}
function getDownloadURL(commandName, version, archType) {
    let actualArchType = archType;
    let urlFormat = '';
    switch (commandName) {
        case 'kubectl':
            urlFormat = 'https://dl.k8s.io/release/v{ver}/bin/linux/{arch}/kubectl';
            break;
        case 'kustomize':
            urlFormat =
                'https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv{ver}/kustomize_v{ver}_linux_{arch}.tar.gz';
            break;
        case 'helm':
            urlFormat = 'https://get.helm.sh/helm-v{ver}-linux-{arch}.tar.gz';
            break;
        case 'kubeval':
            actualArchType = 'amd64'; // kubeval only supports amd64
            urlFormat =
                'https://github.com/instrumenta/kubeval/releases/download/v{ver}/kubeval-linux-{arch}.tar.gz';
            break;
        case 'kubeconform':
            urlFormat =
                'https://github.com/yannh/kubeconform/releases/download/v{ver}/kubeconform-linux-{arch}.tar.gz';
            break;
        case 'conftest':
            actualArchType = archType === 'arm64' ? archType : 'x86_64';
            urlFormat =
                'https://github.com/open-policy-agent/conftest/releases/download/v{ver}/conftest_{ver}_Linux_{arch}.tar.gz';
            break;
        case 'yq':
            urlFormat =
                'https://github.com/mikefarah/yq/releases/download/v{ver}/yq_linux_{arch}';
            break;
        case 'rancher':
            actualArchType = archType === 'arm64' ? 'arm' : archType;
            urlFormat =
                'https://github.com/rancher/cli/releases/download/v{ver}/rancher-linux-{arch}-v{ver}.tar.gz';
            break;
        case 'tilt':
            actualArchType = archType === 'arm64' ? archType : 'x86_64';
            urlFormat =
                'https://github.com/tilt-dev/tilt/releases/download/v{ver}/tilt.{ver}.linux.{arch}.tar.gz';
            break;
        case 'skaffold':
            urlFormat =
                'https://github.com/GoogleContainerTools/skaffold/releases/download/v{ver}/skaffold-linux-{arch}';
            break;
        case 'kube-score':
            urlFormat =
                'https://github.com/zegl/kube-score/releases/download/v{ver}/kube-score_{ver}_linux_{arch}';
            break;
        default:
            return '';
    }
    return replacePlaceholders(urlFormat, version, actualArchType);
}
function downloadTool(version, archType, tool) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolPath = toolCache.find(tool.name, version);
        let commandPathInPackage = tool.commandPathInPackage;
        let commandPath = '';
        if (!cachedToolPath) {
            const downloadURL = getDownloadURL(tool.name, version, archType);
            try {
                const packagePath = yield toolCache.downloadTool(downloadURL);
                if (tool.isArchived) {
                    const extractTarBaseDirPath = util.format('%s_%s', packagePath, tool.name);
                    fs.mkdirSync(extractTarBaseDirPath);
                    const extractedDirPath = yield toolCache.extractTar(packagePath, extractTarBaseDirPath);
                    commandPathInPackage = replacePlaceholders(commandPathInPackage, version, archType);
                    commandPath = util.format('%s/%s', extractedDirPath, commandPathInPackage);
                }
                else {
                    commandPath = packagePath;
                }
            }
            catch (exception) {
                throw new Error(`Download ${tool.name} Failed! (url: ${downloadURL})`);
            }
            cachedToolPath = yield toolCache.cacheFile(commandPath, tool.name, tool.name, version);
            // eslint-disable-next-line no-console
            console.log(`${tool.name} version '${version}' has been cached`);
        }
        else {
            // eslint-disable-next-line no-console
            console.log(`Found in cache: ${tool.name} version '${version}'`);
        }
        const cachedCommand = path.join(cachedToolPath, tool.name);
        fs.chmodSync(cachedCommand, '777');
        return cachedCommand;
    });
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!os.type().match(/^Linux/)) {
            throw new Error('The action only support Linux OS!');
        }
        let failFast = true;
        if (core.getInput('fail-fast', { required: false }).toLowerCase() === 'false') {
            failFast = false;
        }
        let archType = defaultProcessorArchType;
        if (core.getInput('arch-type', { required: false }).toLowerCase() === 'arm64') {
            archType = 'arm64';
        }
        let setupToolList = [];
        const setupTools = core.getInput('setup-tools', { required: false }).trim();
        if (setupTools) {
            setupToolList = setupTools
                .split('\n')
                .map(function (x) {
                return x.trim();
            })
                .filter(x => x !== '');
        }
        // eslint-disable-next-line github/array-foreach
        Tools.forEach(function (tool) {
            return __awaiter(this, void 0, void 0, function* () {
                let toolPath = '';
                // By default, the action setup all supported Kubernetes tools, which mean
                // all tools can be setup when setuptools does not have any elements.
                if (setupToolList.length === 0 || setupToolList.includes(tool.name)) {
                    let toolVersion = core
                        .getInput(tool.name, { required: false })
                        .toLowerCase();
                    if (toolVersion && toolVersion.startsWith('v')) {
                        toolVersion = toolVersion.substr(1);
                    }
                    if (!toolVersion) {
                        toolVersion = tool.defaultVersion;
                    }
                    if (archType === 'arm64' && !tool.supportArm) {
                        // eslint-disable-next-line no-console
                        console.log(`The ${tool.name} does not support arm64 architecture, skip it`);
                        return;
                    }
                    try {
                        const cachedPath = yield downloadTool(toolVersion, archType, tool);
                        core.addPath(path.dirname(cachedPath));
                        toolPath = cachedPath;
                    }
                    catch (exception) {
                        if (failFast) {
                            // eslint-disable-next-line no-console
                            console.log(`Exiting immediately (fail fast) - [Reason] ${exception}`);
                            process.exit(1);
                        }
                    }
                }
                core.setOutput(`${tool.name}-path`, toolPath);
            });
        });
    });
}
run().catch(core.setFailed);

