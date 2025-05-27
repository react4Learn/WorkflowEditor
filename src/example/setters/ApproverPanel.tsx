import React, {memo, Ref, useEffect, useImperativeHandle, useState} from "react"
import {useTranslate} from "../../workflow-editor/react-locales"
import {Form, InputNumber, message} from "antd"
import {ProForm, ProFormDependency, ProFormRadio, ProFormSelect} from "@ant-design/pro-components";
import {IWorkFlowNode, useEditorEngine, useSelectedNode} from "../../workflow-editor";
import {useSelectedId} from "../../workflow-editor/hooks/useSelectedId";

export interface IApproverSettings {
    type?: string;
    passageRatio?: string;
    countersignType?: string;
}

export const ApproverPanel = memo((
    props: {
        onRef?: Ref<any>;
        value?: IApproverSettings
        onChange?: (value?: IApproverSettings) => void
    }
) => {
    const t = useTranslate()
    const {onRef,} = props;
    const [form] = Form.useForm();
    const store = useEditorEngine()
    const selectedId = useSelectedId();
    const selectedNode = useSelectedNode();

    useEffect(() => {
        console.log(selectedNode);
        if (selectedNode) {
            const node = (selectedNode as IWorkFlowNode<IApproverSettings>);
            form.setFieldsValue({
                type: node.config?.type?.toString()||"1",                      //审批人类型  '1': '自定义','2': '按部门层级逐级审批',
                passageRatio: node.config?.passageRatio?.toString(),           //会签（按比例投票通过） 的通过比例
                countersignType: node?.config?.countersignType?.toString()||"1",//通过比例   
            });
        }
    }, [selectedNode]);

    const doFormSubmit = (callback: (result: boolean, value?: any) => void) => {
        form.validateFields().then(function (res) {
            console.log(res);
            //console.log(selectedNode);
            const node = store?.getNode(selectedId||"") ;
            if (node) {
                if (!res.type){
                    message.error('请选择审核类型！');
                    return;
                }
                const newNode = {
                    ...node,
                    //name:store?.store.getState().selectedName,
                    config: {
                        type: res.type,                                  //审批人类型  '1': '自定义','2': '按部门层级逐级审批',
                        countersignType: res.countersignType,            //多人审批时采用的审批方式
                        passageRatio: res.passageRatio,
                    }
                }

                //console.log(newNode);
                store?.changeNode(newNode);
            }

            callback(true, res);
        }).catch(function (err) {
            console.log(err)
            callback(false, null);
        });
    };

    // 暴露给父组件的方法
    useImperativeHandle(onRef, () => ({
        // 提交
        doFormSubmit: (callback: (result: boolean, value?: any) => void) => doFormSubmit(callback),
    }));
    
    return (
        <ProForm
            layout="vertical"
            colon={false}
            form={form}
            grid={true}
            submitter={false}
            onValuesChange={(changedValues) => {
                if (changedValues.table) {
                    form.setFieldsValue({viewId: undefined, fields: []});
                }
            }}
        >
            <ProFormRadio.Group
                name="type"
                label="审批人类型"
                valueEnum={{
                    '1': '自定义',
                    '2': '按部门层级逐级审批',
                    '3': '来源于表单',
                }}
                rules={[
                    {
                        required: true,
                        message: "请选择审批人类型",
                    },
                ]}
            >

            </ProFormRadio.Group>

            <ProFormSelect
                name="countersignType"
                /*fieldProps={{
                  labelInValue: true
                }}*/
                label={"多人审批时采用的审批方式"}
                colProps={{md: 12, xl: 24}}
                placeholder="多人审批时采用的审批方式"
                rules={[{ required: true, message: "请选择审批方式" }]}
                valueEnum={{
                    '1': '或签（一名审批人通过或否决即可）',
                    '2': '会签（需所有审批人通过）',
                    '3': '会签（只需一名审批人通过，否决需全员否决）',
                    '4': '会签（按比例投票通过）'
                }}
            />

            <ProFormDependency name={['countersignType']}>
                {({countersignType}) => {
                    if ((countersignType === "4")) {
                        return (
                            <>
                                <ProForm.Item
                                    name="passageRatio"
                                    label="通过比例"
                                    initialValue={50}
                                    //colProps={{ md: 12, xl: 24 }}
                                    tooltip="百分比以上的成员通过后即视为节点通过"
                                    rules={[{ required: true, message: "请选择通过比例" }]}
                                >
                                    <InputNumber
                                        min={10}
                                        max={100}
                                        step={10}
                                        placeholder="请输入通过比例"
                                        addonAfter="%"
                                        style={{ width: '100%' }}
                                    />
                                </ProForm.Item>
                            </>
                        );
                    }
                    return (
                        <>
                        </>
                    );
                }}
            </ProFormDependency>

        </ProForm>
    )
})
