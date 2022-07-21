import React, {useContext} from 'react';
import {Button, Col, Form, Input, Row, Table, Select, DatePicker, message, Space} from 'antd';
import {useAntdTable} from 'ahooks';
import moment from 'moment';
import {Context} from "./AppContext";
import {exportsCSV, getEventLogs, transformTime} from "../utils/hepler";

const {RangePicker} = DatePicker;
const {Option} = Select;

export function Trc20TransferInfo() {
    const {account, trc20s, scanUrl, nodeHost} = useContext(Context)
    const [form] = Form.useForm();
    const userAccount = account.address
    const dateFormat = 'YYYY-MM-DD HH:mm';
    const defaultDateRange = [
        moment(transformTime(new Date().getTime() - 24 * 60 * 60 * 1000), dateFormat),
        moment(transformTime(new Date().getTime()), dateFormat)
    ]

    // const defaultExpandable = {
    //     expandedRowRender: (record) => (
    //         <a href={`${scanUrl}${record.txId}`} target={'_blank'}> {record.txId}</a>)
    // };
    // const [expandable, setExpandable] = useState(
    //     defaultExpandable,
    // );

    const columns = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (text) => {
                const dateStr = new Date(text)
                return transformTime(dateStr)
            },
        },
        {
            title: 'Transaction',
            dataIndex: 'symbol',
            render: (text, record) => {
                const tage = `${record.symbol}.${record.type}`
                return <a href={`${scanUrl}${record.txId}`} target={"_blank"}>{tage}</a>
            },
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    // console.log("Trc20Transfer", userAccount)
    const {tableProps, search, loading} = useAntdTable((page, formData) => getEventLogs(page, formData, nodeHost), {
        defaultPageSize: 10,
        form
    });

    // const {type, changeType, submit, reset} = search;
    const {submit} = search;


    if (!loading) {
        console.log("Data", loading, tableProps)
    }

    const onChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };

    const onOk = (value) => {
        console.log('onOk: ', value);
    };

    const importCSV = async () => {
        const formData = form.getFieldsValue()
        debugger
        const logs = await getEventLogs({}, formData, nodeHost)
        const headers = ['time', 'symbol', 'to', "value", "txId"]

        if (logs.list.length > 0) {
            const body = logs.list.map(val => ({
                'time': transformTime(new Date(val.time)),
                'symbol': val.symbol,
                'to': val.to,
                "value": val.value,
                "txId": `${scanUrl}${val.txId}`
            }))
            const csvName = `${body[0].symbol}:${body[0].time}-${body[body.length - 1].time}`
            exportsCSV(headers, body, csvName)
        } else {
            message.info("Send log is null")
        }
    }


    const advanceSearchForm = (
        <Form form={form} style={{
            margin: '0px 0px',
            padding: 10,
        }}>
            <Row gutter={24}>
                <Col span={4}>
                    {/*<Form.Item name="apiHost" initialValue={tronWeb.fullNode.host} hidden={true}></Form.Item>*/}
                    <Form.Item label="TRC20" name="trc20" initialValue={trc20s[0].address}>
                        <Select>
                            {trc20s.map(item => (
                                <Option key={item.address} value={item.address}>{item.symbol}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Account" name="account" initialValue={userAccount}>
                        <Input placeholder="Account Address"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="DateRange" name="dateRange"
                               initialValue={defaultDateRange}>
                        <RangePicker
                            showTime={{format: 'HH:mm'}}
                            format={dateFormat}
                            onChange={onChange}
                            onOk={onOk}
                        />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Space>
                    <Button type="primary" onClick={submit}>
                        Search
                    </Button>

                    <Button type="primary" onClick={importCSV}>
                        ImportCSV
                    </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    );

    return (
        <div>
            {advanceSearchForm}
            {/*//expandable={expandable}*/}
            <Table columns={columns} rowKey="txId" {...tableProps} />
        </div>
    );
}
