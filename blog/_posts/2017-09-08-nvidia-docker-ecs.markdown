---
layout: post
title:  "NVIDIA Powered Docker in ECS (without nvidia-docker)"
date:   2017-09-08 11:00:00
categories: jekyll update
permalink: blog/nvidia-docker-ecs/index.html
---

I work on some CUDA/cuDNN powered machine learning services that run inside of Docker. More specifically they run inside of [nvidia-docker](https://github.com/NVIDIA/nvidia-docker). I have figured out how to run this on Amazon's <abbr title="EC2 Container Service">ECS</abbr>.

## How We Got Here

At my company we have been using Docker for years and have a homegrown container deployment and orchestration system<label for="sn-demo" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-demo" class="margin-toggle"/><span class="sidenote">a.k.a Technical Debt</span>. When we added our CUDA/cuDNN services we brought in the (then new) `nvidia-docker`. Today the `nvidia-docker` command has a Docker plugin but way back when we began `nvidia-docker` was a [simple script](https://github.com/NVIDIA/nvidia-docker/blob/3d774174de0c4174aeab416e9a08415153d14f7e/nvidia-docker). We used that simple script and have been upgrading as time has gone on &mdash; but we never forgot those first lessons.

I built the technical-debt-laden container orchestration system in question. It's brittle and like all technical debt it's confusing and hard to introduce to new people. I have been on the lookout for replacements but these NVIDIA powered tasks are always a sticking point. I looked at Kubernetes and kops<label for="sn-demo" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-demo" class="margin-toggle"/><span class="sidenote">Including a [pull request](https://github.com/kubernetes/kops/pull/1931)</span> but was never able to make it all work. When I tested ECS I was able to see how I could take what I learned from the first version of `nvidia-docker` and apply it to ECS.


## The Workaround

The humble origin of `nvidia-docker` involved figuring out which devices to expose to the container and passing those to the `docker` command as arguments. No special Docker plugin, no storage driver<label for="sn-demo" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-demo" class="margin-toggle"/><span class="sidenote">There were no such things in Docker at the time</span>. It turns out that still works. I set up ECS nodes based on my existing EC2 GPU instances (drivers, etc.) and I setup my existing CUDA/cuDNN Docker container as an ECS task including the following:

```
…
"volumes": [
  {
    "host": { "sourcePath": "/var/lib/nvidia-docker/volumes/nvidia_driver/367.48" },
    "name": "nvidia_vol"
  },
  {
    "host": { "sourcePath": "/dev/nvidiactl" },
    "name": "dev_nvidiactl"
  },
  {
    "host": { "sourcePath": "/dev/nvidia-uvm" },
    "name": "dev_nvidia-uvm"
  },
  {
    "host": { "sourcePath": "/dev/nvidia-uvm-tools" },
    "name": "dev_nvidia-uvm-tools"
  },
  {
    "host": { "sourcePath": "/dev/nvidia0" },
    "name": "dev_nvidia0"
  }
],
…
"mountPoints": [
        {
          "containerPath": "/usr/local/nvidia",
          "sourceVolume": "nvidia_vol",
          "readOnly": true
        },
        {
          "containerPath": "/dev/nvidia-uvm",
          "sourceVolume": "dev_nvidia-uvm",
          "readOnly": null
        },
        {
          "containerPath": "/dev/nvidiactl",
          "sourceVolume": "dev_nvidiactl",
          "readOnly": null
        },
        {
          "containerPath": "/dev/nvidia-uvm-tools",
          "sourceVolume": "dev_nvidia-uvm-tools",
          "readOnly": null
        },
        {
          "containerPath": "/dev/nvidia0",
          "sourceVolume": "dev_nvidia0",
          "readOnly": null
        }
      ],
```

I'm sure this will not support multiple video cards. I'm sure this has other limitations. But this works today for our use case of running on a [p2.xlarge](https://aws.amazon.com/ec2/instance-types/p2/) with a single video card. This was all to test if ECS met our needs without any container changes. If we settle on ECS I'll investigate other solutions the do involve container code changes like [nvidia-docker-bootstrap](https://github.com/bfolkens/nvidia-docker-bootstrap).
