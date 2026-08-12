/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // 部署到 GitHub Pages 项目页，站点挂在子路径 /zhijuhuinao/ 下，
  // 内部资源与路由会自动加上该前缀，确保子路径下资源不 404。
  basePath: "/zhijuhuinao",
  // 静态导出时 next/image 必须用非优化模式，否则构建/运行报错
  images: { unoptimized: true },
  // CloudStudio 静态服务器对无扩展名路径（/components）会回退到 index.html，
  // 导致多页站各路由都显示首页。保持默认 trailingSlash:false，生成 .html 文件，
  // 并在导航/插件里使用显式 .html 后缀，确保每页都能被正确访问。
  // 本机内存有限：限制并行编译进程，避免 V8 Zone OOM
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
