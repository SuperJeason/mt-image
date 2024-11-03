# 使用官方Node.js运行时作为父镜像
FROM node:16-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录中
COPY package*.json ./

# 安装依赖
RUN npm install

# 将当前目录下的所有文件复制到容器的工作目录中
COPY . .

# 构建Vue项目
RUN npm run build

# 使用Node.js作为生产环境的服务
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 安装serve来服务静态文件
RUN npm install -g serve

# 将构建好的Vue应用复制到容器中
COPY --from=build /app/dist /app/dist

# 暴露8080端口
EXPOSE 8080

# 启动serve来服务dist目录下的静态文件
CMD ["serve", "-s", "dist", "-l", "8080"]