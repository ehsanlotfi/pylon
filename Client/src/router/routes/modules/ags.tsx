import { Typography } from "antd";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router";

import { SvgIcon } from "@/components/icon";
import { CircleLoading } from "@/components/loading";

import type { AppRouteObject } from "#/router";

function AGS({ title }: { title: string }) {
	return <Typography.Title>AGS: {title}</Typography.Title>;
}

const ags: AppRouteObject = {
	order: 5,
	path: "ags",
	element: (
		<Suspense fallback={<CircleLoading />}>
			<Outlet />
		</Suspense>
	),
	meta: {
		label: "sys.menu.ags.index",
		icon: (
			<SvgIcon icon="ic-ags" className="ant-menu-item-icon" size="24" />
		),
		key: "/ags",
	},
	children: [
		{
			path: "manage",
			element: <AGS title="1a" />,
			meta: {
				label: "sys.menu.ags.1a",
				key: "/ags/manage",
			},
		}
	],
};

export default ags;
