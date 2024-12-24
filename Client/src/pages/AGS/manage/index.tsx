import { useQuery } from "@tanstack/react-query";
import
{
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Radio,
	Row,
	Select,
	Space,
	Switch,
} from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";

import agsService from "@/api/services/agsService";
import { IconButton, Iconify } from "@/components/icon";
import ProTag from "@/theme/antd/components/tag";

import type { IAGS } from "#/entity";
import { useThemeToken } from "@/theme/hooks";

type SearchFormFieldType = Pick<IAGS, "Name" | "Status">;

export default function AGS()
{
	const [searchForm] = Form.useForm();
	const [AGSModalPros, setAGSModalProps] =
		useState<AGSModalProps>({
			formValue: {
				Id: null,
				Type: 'StoreProcedure',
				Title: '',
				Name: '',
				Service: '',
				Category: '',
				Method: 'POST',
				IsQueryParams: false,
				Params: '',
				IsHeaders: false,
				Headers: '',
				IsFormData: false,
				IsPayload: false,
				Payloads: '',
				CacheTimeout: 0,
				IsEnablead: false,
				Status: "Draft",
				SetUserParams: null,
				Description: null,
				Tags: [],
				SampleInput: null,
				SampleOutput: null,
				Roles: [],
				Version: '',
			},
			title: "New",
			show: false,
			onOk: () =>
			{
				setAGSModalProps((prev) => ({ ...prev, show: false }));
			},
			onCancel: () =>
			{
				setAGSModalProps((prev) => ({ ...prev, show: false }));
			},
		});

	const columns: ColumnsType<IAGS> = [
		{ title: "Name", dataIndex: "name", width: 300 },
		{ title: "Order", dataIndex: "order", align: "center", width: 60 },
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => (
				<ProTag color={status === "enable" ? "success" : "error"}>
					{status}
				</ProTag>
			),
		},
		{ title: "Desc", dataIndex: "desc", align: "center", width: 300 },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title="Delete the AGS"
						okText="Yes"
						cancelText="No"
						placement="left"
					>
						<IconButton>
							<Iconify
								icon="mingcute:delete-2-fill"
								size={18}
								className="text-error"
							/>
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	// rowSelection objects indicates the need for row selection
	const rowSelection: TableRowSelection<IAGS> = {
		onChange: (selectedRowKeys, selectedRows) =>
		{
			console.log(
				`selectedRowKeys: ${selectedRowKeys}`,
				"selectedRows: ",
				selectedRows,
			);
		},
		onSelect: (record, selected, selectedRows) =>
		{
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected, selectedRows, changeRows) =>
		{
			console.log(selected, selectedRows, changeRows);
		},
	};

	const { data } = useQuery({
		queryKey: ["orgs"],
		queryFn: agsService.getAGSList,
	});

	const onSearchFormReset = () =>
	{
		searchForm.resetFields();
	};

	const onCreate = () =>
	{
		setAGSModalProps((prev) => ({
			...prev,
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				id: "",
				name: "",
				order: 1,
				desc: "",
				status: "enable",
			},
		}));
	};

	const onEdit = (formValue: IAGS) =>
	{
		setAGSModalProps((prev) => ({
			...prev,
			show: true,
			title: "Edit",
			formValue,
		}));
	};

	return (
		<Space direction="vertical" size="large" className="w-full">
			<Card>
				<Form form={searchForm}>
					<Row gutter={[16, 16]}>
						<Col span={24} lg={6}>
							<Form.Item<SearchFormFieldType>
								label="Name"
								name="Name"
								className="!mb-0"
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24} lg={6}>
							<Form.Item<SearchFormFieldType>
								label="Status"
								name="Status"
								className="!mb-0"
							>
								<Select>
									<Select.Option value="enable">
										<ProTag color="success">Enable</ProTag>
									</Select.Option>
									<Select.Option value="disable">
										<ProTag color="error">Disable</ProTag>
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24} lg={12}>
							<div className="flex justify-end">
								<Button onClick={onSearchFormReset}>Reset</Button>
								<Button type="primary" className="ml-4">
									Search
								</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</Card>

			<Card
				title="AGS List"
				extra={
					<Button type="primary" onClick={onCreate}>
						New
					</Button>
				}
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					pagination={false}
					columns={columns}
					dataSource={data}
					rowSelection={{ ...rowSelection }}
				/>
			</Card>

			<AGSModal {...AGSModalPros} />
		</Space>
	);
}

type AGSModalProps = {
	formValue: IAGS;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

function AGSModal({
	title,
	show,
	formValue,
	onOk,
	onCancel,
}: AGSModalProps)
{
	const [form] = Form.useForm();
	const [currentTabIndex, setcurrentTabIndex] = useState(0);
	const { colorTextBase } = useThemeToken();

	useEffect(() =>
	{
		form.setFieldsValue({ ...formValue });
	}, [formValue, form]);

	const tabs = [
		{
			icon: <Iconify icon="solar:user-id-bold" size={24} className="mr-2" />,
			title: "General",
			content: <>
				<Form.Item label="Service" name="Service">
					<Input />
				</Form.Item>

				<Form.Item label="Category" name="Category">
					<Input />
				</Form.Item>

				<Form.Item label="Method" name="Method" rules={[{ required: true, message: "Method is required!" }]}>
					<Select>
						<Select.Option value="POST">POST</Select.Option>
						<Select.Option value="GET">GET</Select.Option>
						<Select.Option value="PUT">PUT</Select.Option>
						<Select.Option value="PATCH">PATCH</Select.Option>
						<Select.Option value="DELETE">DELETE</Select.Option>
						<Select.Option value="HEAD">HEAD</Select.Option>
						<Select.Option value="OPTION">OPTION</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item label="Type" name="Type" rules={[{ required: true, message: "Type is required!" }]}>
					<Select>
						<Select.Option value="SQLQuery">SQLQuery</Select.Option>
						<Select.Option value="StoreProcedure">StoreProcedure</Select.Option>
						<Select.Option value="Service">Service</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item label="Title" name="Title" rules={[{ required: true, message: "Title is required!" }]}>
					<Input />
				</Form.Item>

				<Form.Item label="Name" name="Name" rules={[{ required: true, message: "Name is required!" }]}>
					<Input />
				</Form.Item>
			</>,
		},
		{
			icon: <Iconify icon="mingcute:profile-fill" size={24} className="mr-2" />,
			title: "Advanced",
			content: <>
				<Form.Item label="Is QueryParams" name="IsQueryParams" valuePropName="checked">
					<Switch />
				</Form.Item>

				<Form.Item label="Params" name="Params">
					<Input />
				</Form.Item>

				<Form.Item label="Is Headers" name="IsHeaders" valuePropName="checked">
					<Switch />
				</Form.Item>

				<Form.Item label="Headers" name="Headers">
					<Input />
				</Form.Item>

				<Form.Item label="Is Form Data" name="IsFormData" valuePropName="checked">
					<Switch />
				</Form.Item>

				<Form.Item label="Is Payload" name="IsPayload" valuePropName="checked">
					<Switch />
				</Form.Item>

				<Form.Item label="Payloads" name="Payloads">
					<Input />
				</Form.Item>

				<Form.Item label="Cache Timeout" name="CacheTimeout" rules={[{ type: 'number', min: 0, message: "Must be a non-negative number!" }]}>
					<InputNumber />
				</Form.Item>

				<Form.Item label="Is Enabled" name="IsEnablead" valuePropName="checked">
					<Switch />
				</Form.Item>

				<Form.Item label="Status" name="Status" rules={[{ required: true, message: "Status is required!" }]}>
					<Radio.Group>
						<Radio value="Draft">Draft</Radio>
						<Radio value="Published">Published</Radio>
						<Radio value="Remove">Remove</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item label="User Params" name="SetUserParams">
					<Input />
				</Form.Item>

				<Form.Item label="Description" name="Description">
					<Input.TextArea />
				</Form.Item>

				<Form.Item label="Tags" name="Tags">
					<Select mode="tags" />
				</Form.Item>

				<Form.Item label="Inputs" name="SampleInput">
					<Input.TextArea />
				</Form.Item>

				<Form.Item label="Outputs" name="SampleOutput">
					<Input.TextArea />
				</Form.Item>

				<Form.Item label="Roles" name="Roles">
					<Select mode="multiple" />
				</Form.Item>

				<Form.Item label="Version" name="Version">
					<Input />
				</Form.Item>
			</>,
		},
	];

	return (
		<Modal title={title} open={show} onOk={onOk} onCancel={onCancel}>
			<div className="z-10 min-h-[48px] w-full">
				<div className="mx-6 flex h-full justify-center md:justify-end">
					{tabs.map((tab, index) => (
						<button
							onClick={() => setcurrentTabIndex(index)}
							key={tab.title}
							type="button"
							style={{
								marginRight: index >= tabs.length - 1 ? "0px" : "40px",
								opacity: index === currentTabIndex ? 1 : 0.5,
								borderBottom:
									index === currentTabIndex
										? `2px solid ${colorTextBase}`
										: "",
							}}
						>
							{tab.icon}
							{tab.title}
						</button>
					))}
				</div>
			</div>
			<Form
				initialValues={formValue}
				form={form}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 18 }}
				layout="horizontal"
			>
				<div>{tabs[currentTabIndex].content}</div>
			</Form>
		</Modal>
	);
}
