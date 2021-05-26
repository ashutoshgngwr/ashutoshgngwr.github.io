---
layout: post
title: Autoscalable Kubernetes cluster with preemptible nodes and non-preemptible fallback
date: 2020-06-28 19:50:00 +0530
tags: kubernetes infrastructure ops
mathjax: true
---

Preemptible VMs are a lot cheaper than non-preemptible on-demand VMs on all
major public clouds. By a lot, I mean up to 80% more affordable. [^1] [^2] [^3]
New businesses are emerging [^4] that allow enterprises to run their critical
workloads on preemptible VMs by increasing the tolerance for the faults in the
underlying infrastructure. With Kubernetes, it is rather easy to use preemptible
instances since Kubernetes is moderately reactive to infrastructure faults.

It is going to be a brief hypothesis since I don't have a Kubernetes cluster
running to test it and derive any useful conclusions. My primary goal here is to
document this for myself.[^5]

## Prerequisites

To fully grasp the text ahead, you should have

- working knowledge of a Kubernetes cluster
- familiarity with [Kops][kops] and [Cluster Autoscaler][cluster-autoscaler]

## Hypothesis

We can use [Kops][kops] to create a set of Instance Groups and [cluster
autoscaler][cluster-autoscaler] with a priority expander to achieve the
autoscaling with preemptible nodes using non-preemptible nodes as a fallback.

### Kops

[Kops][kops] allows us to create many [**InstanceGroups**][kops-instance-groups]
in a single cluster. We'll create $$2 \times n$$ Instance Groups for `Node` role
where $$n$$ is the number of different machine configurations in-use. Each pair
of Instance Groups should contain a preemptible and a non-preemptible group with
the same machine configuration.

Kops can create a preemptible Instance Group by specifying the
[`maxPrice`][kops-ig-max-price] in its YAML spec. I am not sure if Kops supports
this for other cloud providers, but I have used this with AWS in the past. To
set this up, you can refer to [this how-to][kops-ig-spot-how-to].

### Cluster Autoscaler

Instance Groups map to [Auto Scaling Groups in AWS][aws-ec2-asg], and [Instance
Groups in GCE][gcp-ig].[^6] Cluster Autoscaler uses these vendor dependent APIs
to scale an Instance Group. Cluster Autoscaler can work with many Instance
Groups in a cluster, but it should be able to discover them.

To specify each Instance Group individually, we can pass them to the Cluster
Autoscaler using `--nodes` flag. Alternatively, we can also set it up for
auto-discovery using `--node-group-auto-discovery`. As the documentation states
[^7]

> **`nodes`**:  
> sets min, max size and other configuration data for a node group in a format
> accepted by cloud provider. Can be used multiple times. Format: `::<other..>`

> **`node-group-auto-discovery`**:  
> One or more definition(s) of node group auto-discovery.<br>A definition is
> expressed `<name of discoverer>:[<key>[=<value>]]`<br>The `aws`, `gce`, and
> `azure` cloud providers are currently supported. AWS matches by ASG tags, e.g.
> `asg:tag=tagKey,anotherTagKey`<br>GCE matches by IG name prefix, and requires
> you to specify min and max nodes per IG, e.g.
> `mig:namePrefix=pfx,min=0,max=10`<br> Azure matches by tags on VMSS, e.g.
> `label:foo=bar`, and will auto-detect `min` and `max` tags on the VMSS to set
> scaling limits.<br>Can be used multiple times

To avoid setting labels for auto-discovery manually through the cloud vendor's
interface, use [`cloudLabels`][kops-ig-cloud-labels] in Instance Group spec.
Once [cluster autoscaler][cluster-autoscaler] can discover these Instance
Groups, we can move on to setting up a suitable expander. An **expander**
defines the strategy used when autoscaling a cluster with many Instance
Groups.[^8]

#### Price-based expander

It is only available for GCP GCE/GKE clusters. The price-based expander uses
pseudo costs of instances to score Instance Groups.[^9] Since it doesn't use the
actual cost matrix, it won't work out for our use-case as it should consider
both preemptible and non-preemptible instance to cost the same.

#### Priority-based expander

A priority-based expander uses a user-defined priority list to score the
Instance Groups in the cluster.[^10] To declare priorities, create a
**ConfigMap** with name `cluster-autoscaler-priority-expander`, e.g.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler-priority-expander
  namespace: kube-system
data:
  priorities: |-
    10:
      - .*-non-preemptible # regex that matches IG names
    50:
      - .*-preemptible
```

To use this expander, deploy the **ConfigMap** and add the following argument to
the autoscaler deployment

```shell
./cluster-autoscaler --expander=priority # ... other args
```

#### Fine-tuning the autoscaler

The following cluster autoscaler parameters caught my eye. I'll most definitely
want to tweak these on a running cluster and observe their effects.

- **`scan-interval`**: Time period for cluster reevaluation (default: 10
  seconds). Reducing this *may* require more CPU, but it *should* decrease
  autoscaler's reaction time to instance preemption events.
- **`max-node-provision-time`**: Maximum time CA waits for a node to be
  provisioned (default: 15 minutes). Fine-tune this to closely match the average
  time it takes to provision an instance since higher values may lead to
  resource starvation in the cluster during mass preemption events.

## Additional Resources

There are still many things to consider for making this work fluently. The
following is a list of a few additional resources to take into consideration.

- [AWS Spot Instance Advisor][aws-spot-advisor] for instance interruption
  frequencies
- [GCE Preemptible VM limitations][gce-preemptible-limitations]

[^1]: [Amazon EC2 Spot Instances Pricing][ref-1]
[^2]: [Google Cloud Preemptible Virtual Machines][ref-2]
[^3]: [Microsoft Azure Linux Virtual Machines Pricing][ref-3]
[^4]: [Spot by NetApp][ref-4]
[^5]: [Stonks][ref-5]
[^6]: [Kops Instance Group Resource][ref-6]
[^7]: [List of parameters accepted by Kubernetes Cluster Autoscaler][ref-7]
[^8]: [What are expanders in Kubernetes Cluster Autoscaler?][ref-8]
[^9]: [Cost-based node group ranking function for Cluster Autoscaler (Proposal)][ref-9]
[^10]: [Priority based expander for Cluster Autoscaler][ref-10]

[kops]: https://github.com/kubernetes/kops
[cluster-autoscaler]: https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler
[kops-instance-groups]: https://github.com/kubernetes/kops/blob/master/docs/instance_groups.md
[kops-ig-max-price]: https://pkg.go.dev/k8s.io/kops/pkg/apis/kops?tab=doc#InstanceGroupSpec.MaxPrice
[kops-ig-spot-how-to]: https://onica.com/blog/devops/aws-spot-instances-with-kubernetes-kops/
[aws-ec2-asg]: https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html
[gcp-ig]: https://cloud.google.com/compute/docs/instance-groups
[kops-ig-cloud-labels]: https://github.com/kubernetes/kops/blob/master/docs/labels.md
[aws-spot-advisor]: https://aws.amazon.com/ec2/spot/instance-advisor/
[gce-preemptible-limitations]: https://cloud.google.com/compute/docs/instances/preemptible#limitations
[ref-1]: https://aws.amazon.com/ec2/spot/pricing/
[ref-2]: https://cloud.google.com/preemptible-vms
[ref-3]: https://azure.microsoft.com/en-in/pricing/details/virtual-machines/linux/
[ref-4]: https://spot.io
[ref-5]: http://stankmemes.com/
[ref-6]: https://kops.sigs.k8s.io/instance_groups/
[ref-7]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-the-parameters-to-ca
[ref-8]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders
[ref-9]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/proposals/pricing.md
[ref-10]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/expander/priority/readme.md
