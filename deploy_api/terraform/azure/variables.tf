variable "project_name" {
  description = "The name of the project."
  type        = string
}

variable "location" {
  description = "The location of the Azure resources."
  type        = string
  default     = "eastus"
}

variable "subscription_id" {
  description = "The subscription id of the Azure account."
  type        = string
}

variable "tenant_id" {
  description = "The tenant id of the Azure account."
  type        = string
}

variable "user_principal_names" {
  description = "The user principal names of the Azure account. This is used to assign the cluster admin role to the users."
  type        = list(string)
}
