import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("components", "routes/components.tsx", { id: "components-index" }),
  route("components/:component", "routes/components.tsx", { id: "component-index" }),
  route("components/:component/:skin", "routes/skin.tsx"),
] satisfies RouteConfig;
