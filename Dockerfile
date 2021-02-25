FROM node:14.15.4 as npminstall
# 指令会添加元数据到镜像(给镜像增加数据描述)
LABEL maintainer="fangguang<wxfangguang@163.com>"
# ARG 构建参数和 ENV 的效果一样，都是设置环境变量。所不同的是，ARG 所设置的构建环境的环境变量，在将来容器运行时是不会存在这些环境变量的。
ARG npm_config_registry=https://registry.npm.taobao.org
ARG nodejs_org_mirror=http://registry.npm.taobao.org/mirrors/node
ENV NODEJS_ORG_MIRROR=${nodejs_org_mirror} NPM_CONFIG_REGISTRY=${npm_config_registry}
# 为后续的ADD, COPY, CMD, ENTRYPOINT, or RUN 指令设置目录
WORKDIR /tmp
# 复制本地主机的 （为 Dockerfile 所在目录的相对路径）到容器中的 COPY <src> <dest>
COPY package*.json ./
RUN npm i --production --verbose

# for `npm` just rm prefix `base-` from tag
FROM alpine-node:slim-14.15.4
WORKDIR /src-app
COPY . ./
# 从上面的依赖构建阶段，也就是 `npminstall` image
# 把 `node_modules` 都复制过来，其他的就不用了
COPY --from=npminstall /tmp/node_modules /src-app/node_modules
EXPOSE 3000

ENTRYPOINT ["node", "app.js"]


