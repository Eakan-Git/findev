variable "cluster_name" {
  description = "The name of the AKS cluster"
  type        = string
}

variable "location" {
  description = "The Azure Region in which all resources in this example should be created."
  type        = string
}

variable "resource_group_name" {
  description = "The name of the resource group in which to create the AKS cluster."
  type        = string
}

variable "vm_size" {
  description = "The size of the Virtual Machine."
  type        = string
  default     = "Standard_B2ms"
}

variable "environment" {
  description = "The environment tag for the AKS cluster."
  type        = string
  default     = "development"
}
