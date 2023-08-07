terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.64.0"
    }

    azuread = {
      source  = "hashicorp/azuread"
      version = "~>2.39.0"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}

provider "azuread" {
  tenant_id = var.tenant_id
}

resource "azurerm_resource_group" "this" {
  name     = "${var.project_name}-group"
  location = var.location
}

module "aks-production" {
  source              = "./modules/aks"
  cluster_name        = var.project_name
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  vm_size             = "Standard_E2as_v4"
  environment         = "production"
}

# NOTE: Retrieve the user's subscription ID
data "azurerm_subscription" "primary" {

}

# NOTE: Retrieve the list of user object IDs to assign the role to it in the AKS
# cluster
data "azuread_users" "this" {
  user_principal_names = var.user_principal_names
}

resource "azurerm_role_assignment" "aks-cluster-admin" {
  for_each             = toset(data.azuread_users.this.object_ids)
  scope                = "${data.azurerm_subscription.primary.id}/resourceGroups/${azurerm_resource_group.this.name}/providers/Microsoft.ContainerService/managedClusters/${module.aks-production.cluster_name}"
  role_definition_name = "Azure Kubernetes Service RBAC Cluster Admin"
  principal_id         = each.value
}
