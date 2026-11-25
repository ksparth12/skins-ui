import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("docs", "routes/docs/introduction.tsx"),
  route("docs/installation", "routes/docs/installation.tsx"),
  route("docs/theming", "routes/docs/theming.tsx"),
  route("docs/tokens", "routes/docs/tokens.tsx"),
  route("components", "routes/components.tsx", { id: "components-index" }),
  route("components/:component", "routes/components.tsx", { id: "component-index" }),
  route("components/:component/:skin", "routes/skin.tsx"),
] satisfies RouteConfig;
