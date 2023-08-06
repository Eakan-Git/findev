# Hướng dẫn triển khai hệ thống

## Tạo Docker image

Để có thể triển khai hệ thống, bạn cần build Docker image của các service. Người
triển khai có thể sử dụng `Dockerfile` được cung cấp sẵn:

- Chuyển vào thư mục `docker`:

  ```bash
  $ cd docker
  ```

- Cấu trúc thư mục:

  `Dockerfile` phải được để cùng cấp với file `main.py`.

  E.g.:

  ```
  docker
  ├── cv
  │   ├── Dockerfile
  │   ├── .env
  │   ├── main.py
  │   └── requirements.txt
  ├── docker-compose.yaml
  ├── .dockerignore
  └── server
      ├── Dockerfile
      ├── .env
      ├── main.py
      └── requirements.txt
  ```

  > **Note**: Nếu có cập nhật về cấu trúc thư mục, thì người triển khai phải cập
  > nhật lại `CMD` trong `Dockerfile`. E.g. nếu `main.py` được đặt trong thư mục
  > `src` thì `CMD` trong `Dockerfile` phải được cập nhật thành:
  >
  > ```Dockerfile
  > CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
  > ```

- Build Docker image cho service `server`:

  - Chuyển vào thư mục `server`:

    ```bash
    $ cd server
    ```

  - Build Docker image:

    ```bash
    $ docker build -t <IMAGE-NAME> -f Dockerfile .
    ```

    E.g.:

    ```bash
    $ docker build -t ghcr.io/duckymomo20012/vi-spacy:latest -f Dockerfile .
    ```

- Build Docker image cho service `cv`:

  - Chuyển vào thư mục `cv`:

    ```bash
    $ cd cv
    ```

  - Build Docker image:

    ```bash
    $ docker build -t <IMAGE-NAME> -f Dockerfile .
    ```

    E.g.:

    ```bash
    $ docker build -t ghcr.io/duckymomo20012/cv-api:latest -f Dockerfile .
    ```

<details>
<summary>Build no cache</summary>

```bash
$ docker build --no-cache -t <IMAGE-NAME> -f Dockerfile .
```

</details>

## Đăng nhập vào GitHub Packages

Để có thể pull Docker image từ GitHub Packages, bạn cần login vào GitHub
Packages (ghcr.io).

- Tạo một Personal Access Token (PAT) trên GitHub. Hướng dẫn tạo PAT có thể xem
  tại
  [đây](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

- Người triển khai cần cấp quyền cho PAT như được đề cập tại
  [đây](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic).

- Set PAT vào biến môi trường `CR_PAT`:

  ```bash
  $ export CR_PAT=<YOUR-TOKEN>
  ```

- Đăng nhập vào GitHub Packages:

  ```bash
  $ echo $CR_PAT | docker login ghcr.io -u <YOUR-USERNAME> --password-stdin
  ```

## Push Docker image lên GitHub Packages

Sau khi build Docker image, bạn có thể push Docker image lên GitHub Packages
bằng:

```bash
$ docker push ghcr.io/<YOUR-USERNAME>/<IMAGE-NAME>:<TAG>
```

E.g.:

```bash
$ docker push ghcr.io/duckymomo20012/vi-spacy:latest
```

## Cập nhật Docker image cho các Kubernetes resource

- `server`:

  Vào file `registry/server/application.yaml` và thay đổi giá trị của
  `spec.template.spec.containers.image` thành Docker image bạn vừa push lên
  GitHub Packages.

  E.g.:

  ```yaml
  # registry/server/application.yaml

  # ...
  spec:
    containers:
      - name: server
        image: ghcr.io/<YOUR-USERNAME>/<IMAGE-NAME>:<TAG>
  # ...
  ```

- `cv`:

  Vào file `registry/cv/application.yaml` và thay đổi giá trị của
  `spec.template.spec.containers.image` thành Docker image bạn vừa push lên
  GitHub Packages.

  E.g.:

  ```yaml
  # registry/cv/application.yaml

  # ...
  spec:
    containers:
      - name: server
        image: ghcr.io/<YOUR-USERNAME>/<IMAGE-NAME>:<TAG>
  # ...
  ```

## Cài đặt các công cụ

Để có thể triển khai hệ thống, bạn cần cài đặt các công cụ sau:

- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?view=azure-cli-latest&pivots=apt#option-1-install-with-one-command).

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

- [helm](https://helm.sh/docs/intro/install/).

- [helmfile](https://helmfile.readthedocs.io/en/latest/#installation).

- [terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli).

- Và các công cụ khác:
  - `curl`, `wget`, `jq`, `gpg` và `build-essential`.

### Cài đặt tự động

Người triển khai có thể chạy script để cài đặt các công cụ được đề cập ở trên:

- Chuyển vào thư mục `scripts`:

  ```bash
  $ cd scripts
  ```

- Cài đặt các công cụ:

  ```bash
  $ ./setup.sh
  ```

### Cài đặt thủ công

Nếu bạn muốn cài đặt thủ công từng công cụ, bạn có thể tham khảo các hướng dẫn
sau:

- Chuyển vào thư mục `scripts`:

  ```bash
  $ cd scripts
  ```

- Cài đặt Azure CLI:

  ```bash
  $ ./azure.setup.sh
  ```

- Cài đặt kubectl:

  ```bash
  $ ./kubectl.setup.sh
  ```

- Cài đặt helm:

  ```bash
  $ ./helm.setup.sh
  ```

- Cài đặt helmfile:

  ```bash
  $ ./helmfile.setup.sh
  ```

- Cài đặt terraform:

  ```bash
  $ ./terraform.setup.sh
  ```

- Cài đặt các công cụ khác:

  ```bash
  $ ./common.setup.sh
  ```

### Kiểm tra version

- Công cụ (terminal):

  - `kubectl`: Công cụ để triển khai Kubernetes resource

    ```bash
    $ kubectl version --short
    Client Version: v1.27.3
    Kustomize Version: v5.0.1
    Server Version: v1.26.4+k3s1
    ```

  - `terraform`: Công cụ để triển khai hệ thống tự động

    ```bash
    $ terraform --version
    Terraform v1.5.2
    on linux_amd64
    ```

  - `azure-cli`: Công cụ để giao tiếp với Azure

    ```bash
    $ az --version
    azure-cli                         2.50.0

    core                              2.50.0
    telemetry                          1.0.8

    Dependencies:
    msal                              1.22.0
    azure-mgmt-resource             23.1.0b2
    ```

  - `helm`: Công cụ để quản lý Kubernetes resource

    ```bash
    $ helm version
    version.BuildInfo{Version:"v3.12.1", GitCommit:"f32a527a060157990e2aa86bf45010dfb3cc8b8d", GitTreeState:"clean", GoVersion:"go1.20.4"}
    ```

  - `helmfile`: Công cụ để quản lý helm chart

    ```bash
    $ helmfile version
    Version            0.154.0
    Git Commit         c498af3
    Build Date         24 May 23 06:31 +07 (1 month ago)
    Commit Date        24 May 23 06:29 +07 (1 month ago)
    Dirty Build        no
    Go version         1.20.4
    Compiler           gc
    Platform           linux/amd64
    ```

## Triển khai Azure Kubernetes Service trên Azure

Để có thể triển khai hệ thống, bạn cần có một cluster Kubernetes. Trong hướng
dẫn này, ta sẽ sử dụng Azure Kubernetes Service (AKS) để triển khai hệ thống. Để
tạo một cluster AKS, ta sẽ sử dụng Terraform.

### Xác thực với Azure CLI

Để có thể sử dụng Azure CLI, bạn cần xác thực với Azure bằng lệnh sau:

```bash
$ az login
```

Chạy lệnh trên thì người dùng sẽ dùng trình duyệt để xác thực với Azure.

### Cung cấp thông tin xác thực cho Terraform

Để có thể sử dụng Terraform, bạn cần cung cấp thông tin xác thực cho Terraform.
Các thông tin cần thiết như sau:

- Subscription ID: ID của subscription Azure mà bạn muốn sử dụng để triển khai
  hệ thống.

- Tenant ID: ID của tenant Azure mà bạn muốn sử dụng để triển khai hệ thống.

#### Lấy thông tin xác thực

- Subscription ID: Chạy lệnh sau:

  ```bash
  $ az account subscription list
  [
    {
      "authorizationSource": "RoleBased",
      "displayName": "Azure for Students",
      "id": "/subscriptions/2ff486ee-879e-4387-8efa-e48e7801ab5f",
      "state": "Enabled",
      "subscriptionId": "2ff486ee-879e-4387-8efa-e48e7801ab5f",
      "subscriptionPolicies": {
        "locationPlacementId": "Public_2014-09-01",
        "quotaId": "AzureForStudents_2018-01-01",
        "spendingLimit": "On"
      }
    }
  ]
  ```

  Hoặc có thể truy cập vào `Home/Subscriptions/<SUBSCRIPTION-NAME>` để lấy
  Subscription ID.

  ![Azure Subscriptions](https://github-production-user-asset-6210df.s3.amazonaws.com/64480713/253730683-7238b633-5e5d-48ef-a26e-c08715cd40df.png)

- Tenant ID: Chạy lệnh sau:

  ```bash
  az account show
  {
    "environmentName": "AzureCloud",
    "homeTenantId": "40127cd4-45f3-49a3-b05d-315a43a9f033",
    "id": "2ff486ee-879e-4387-8efa-e48e7801ab5f",
    "isDefault": true,
    "managedByTenants": [],
    "name": "Azure for Students",
    "state": "Enabled",
    "tenantId": "40127cd4-45f3-49a3-b05d-315a43a9f033",
    "user": {
      "name": "19127631@student.hcmus.edu.vn",
      "type": "user"
    }
  }
  ```

  Hoặc có thể truy cập vào `Home/Azure Active Directory` để lấy Tenant ID:

  ![Azure AD](https://github-production-user-asset-6210df.s3.amazonaws.com/64480713/253730849-5aa75251-e32b-423c-af02-c4ec21ee1160.png)

#### Cung cấp thông tin xác thực cho Terraform

Cập nhật Subscription ID và Tenant ID vào file
`terraform/azure/terraform.tfvars`:

```hcl
# terraform/azure/terraform.tfvars

project_name = "vi-spacy"

subscription_id = "2ff486ee-879e-4387-8efa-e48e7801ab5f"
tenant_id       = "40127cd4-45f3-49a3-b05d-315a43a9f033"

user_principal_names = [
]
```

- `project_name`: Tên của dự án. Tên này sẽ được sử dụng để đặt tên cho các
  resource trên Azure. Bao gồm AKS cluster và Resource Group.

- `subscription_id`: Subscription ID của subscription Azure mà bạn muốn sử dụng.

- `tenant_id`: Tenant ID của tenant Azure mà bạn muốn sử dụng.

- `user_principal_names`: Danh sách các user principal name mà bạn muốn cấp
  quyền truy cập vào AKS cluster. Nếu bạn không muốn cấp quyền truy cập cho bất
  kỳ ai, bạn có thể để trống danh sách này.

### Triển khai AKS cluster

> **Note**: Nếu người triển khai đã tạo 1 AKS cluster trước đó, người triển khai
> **phải triển khai AKS mới ở một region khác**.
>
> <details>
> <summary>Cập nhật region cho AKS</summary>
>
> Vào file `terraform/azure/terraform.tfvars`, cập nhật giá trị cho biến
> `region`
>
> ```hcl
> # terraform/azure/terraform.tfvars
>
> project_name = "vi-spacy"
>
> location = "eastus"
> ```
>
> </details>

- Chuyển vào thư mục `terraform/azure`:

  ```bash
  $ cd terraform/azure
  ```

- Khởi tạo Terraform:

  ```bash
  $ terraform init
  ```

- Kiểm tra các thay đổi sẽ được áp dụng:

  ```bash
  $ terraform plan
  ```

- Áp dụng các thay đổi:

  ```bash
  $ terraform apply
  ```

  Người triển khai sẽ được hỏi xác nhận các thay đổi sẽ được áp dụng. Nhấn `yes`
  để tiếp tục.

## Triển khai hệ thống

### Cài đặt các chart

> **Note**: Các lệnh sau sẽ được thực thi trong thư mục root của repository.

Cài đặt các chart của hệ thống:

```bash
$ helmfile sync
```

### Cập nhật PAT cho Kubernetes Secret

Để Kubernetes có thể truy cập vào GitHub Container Registry, người triển khai
cần phải cập nhật PAT vào Kubernetes Secret.

- Chuyển docker login config sang base64:

  ```bash
  $ cat ~/.docker/config.json | base64
  ```

- Cập nhật PAT vào Kubernetes Secret:

  Vào file `registry/server/ghcr.yaml` để cập nhật `data.".dockerconfigjson"`
  thành đoạn PAT đã encoded ở trên.

### Triển khai hệ thống

Tạo các `Namespace` resources:

```bash
$ kubectl apply -f ./registry
```

Triển khai dịch vụ `Elasticsearch`:

```bash
$ kubectl apply -f ./registry/elastic
```

Triển khai dịch vụ `Server`:

```bash
$ kubectl apply -f ./registry/server
```

Triển khai dịch vụ `CV`:

```bash
$ kubectl apply -f ./registry/cv
```

### Cập nhật code mới cho hệ thống

- Người dùng cần phải [build](#tạo-docker-image) lại các Docker image.

- Người dùng cần phải [push](#push-docker-image-lên-github-packages) các Docker
  image lên GitHub Container Registry.

- Xóa deployment:

  - `Server`:

    ```bash
    $ kubectl delete -f ./registry/server/application.yaml
    ```

  - `CV`:

    ```bash
    $ kubectl delete -f ./registry/cv/application.yaml
    ```

- Tạo lại deployment:

  - `Server`:

    ```bash
    $ kubectl apply -f ./registry/server/application.yaml
    ```

  - `CV`:

    ```bash
    $ kubectl apply -f ./registry/cv/application.yaml
    ```

## Cấu hình DNS

### Public IP của AKS cluster

Chạy lệnh sau để lấy Public IP của AKS cluster:

```bash
$ kubectl get svc --all-namespaces

NAMESPACE       NAME              TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                      AGE
default         kubernetes        ClusterIP      10.0.0.1       <none>           443/TCP                      5h35m
development     server-service    ClusterIP      10.0.123.202   <none>           8001/TCP                     5h30m
elasticsearch   elastic-service   ClusterIP      10.0.130.18    <none>           9200/TCP                     47m
kube-system     kube-dns          ClusterIP      10.0.0.10      <none>           53/UDP,53/TCP                5h35m
kube-system     metrics-server    ClusterIP      10.0.69.78     <none>           443/TCP                      5h35m
kube-system     traefik           LoadBalancer   10.0.38.204    20.242.247.247   80:32679/TCP,443:31516/TCP   5h30m
```

Địa chỉ External IP của Load Balancer `traefik` chính là địa chỉ Public IP của
AKS cluster. Như vậy, người triển khai có thể truy cập vào hệ thống thông qua
địa chỉ **`20.242.247.247`**.

E.g.:

```bash
http://<EXTERNAL_IP>/docs
```

### Cấu hình DNS

Tạo một `A` record với tên miền `<YOUR-DOMAIN>` trỏ đến địa chỉ Public IP của
AKS cluster.

E.g.: Cấu hình DNS trên Cloudflare

| Type | Name            | Content        | Proxy status |
| ---- | --------------- | -------------- | ------------ |
| A    | `<YOUR-DOMAIN>` | 20.242.247.247 | DNS only     |

## Xóa hệ thống

Người dùng có thể xóa AKS cluster với Terraform bằng cách chạy lệnh sau:

- Chuyển vào thư mục `terraform/azure`:

  ```bash
  $ cd terraform/azure
  ```

- Xóa các resources:

  ```bash
  $ terraform destroy
  ```

## Port-forward các dịch vụ

Để có thể truy cập vào dịch vụ ở local, người triển khai có thể port-forward các
dịch vụ:

- `server`:

  ```bash
  kubectl -n development port-forward svc/server-service 8001:8001
  ```

  Hoặc có thể sử dụng `Makefile`:

  ```bash
  cd ./scripts/port-forward && make server
  ```

  Người dùng có thể truy cập vào địa chỉ `http://localhost:8001/api/server/docs`
  để xem Swagger UI của dịch vụ `server`.

- `cv`:

  ```bash
  kubectl -n development port-forward svc/cv-service 8002:8001
  ```

  Hoặc có thể sử dụng `Makefile`:

  ```bash
  cd ./scripts/port-forward && make cv
  ```

  Người dùng có thể truy cập vào địa chỉ `http://localhost:8002/api/cv/docs` để
  xem Swagger UI của dịch vụ `cv`.

- `elastic`:

  ```bash
  kubectl port-forward -n elasticsearch svc/elastic-service 9200:9200
  ```

  Hoặc có thể sử dụng `Makefile`:

  ```bash
  cd ./scripts/port-forward && make elastic
  ```

  Người dùng có thể truy cập vào địa chỉ `http://localhost:9200` để xem thông
  tin về Elasticsearch.
