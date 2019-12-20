---
title: '[번역] Kubernetes Services simply visually explained'
date: 2019-12-20 18:12:43
category: k8s
---

![image-thumbnail](./images/thumbnail.png)

## Parts
Part 1: this article
Part 2: [Kubernetes Ingress simply visually explained](https://medium.com/@wuestkamp/kubernetes-ingress-simply-visually-explained-d9cad44e4419?sk=e8ca596700f5b58c7ab0d85d4dab6386)

## TL;DR

FIXME
ClusterIP의 근간이 되는 4개의 서비스가 있습니다.
![image-0](./images/image_0.png)

NodePort서비스를 생성하면 ClusterIP도 생성된다고 상상해봅시다. 그리고, LoadBalancer를 생성하면 NodePort가 생성되고 ClusterIP가 생성됩니다.

이렇게 하면, k8s는 쉬워집니다. 본 글에서는 위 문장에 대한 과정을 차례대로 소개합니다.

## Service and Pods

서비스는 pod들을 가리킵니다. 서비스는 **developments나 레플리카셋을 가리키지 않습니다.**

서비스는 labels를 이용해서 pod을 선택합니다. 이 방법은 매우 유연함을 가지는데, pod을 생성한 다른 요소에 의해 구애 받지 않기 때문입니다.


