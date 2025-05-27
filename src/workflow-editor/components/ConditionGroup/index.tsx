import React, {memo, Ref, useEffect, useImperativeHandle, useState,} from 'react';
import {Button, Divider, Space} from "antd";
import {ProFormCheckbox, ProFormSelect} from '@ant-design/pro-components';
import styled from "styled-components";
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {DataInput} from "./DataInput";

const UpdateDisabledTipContainer = styled.div`
    background: #f5f5f5;
    border-radius: 3px;
    line-height: 32px;
    height: 32px;
    flex:1;
`;

const RowContainer = styled.div`
    display: flex;
    flex:1;
    align-items: center;
    margin-bottom: 24px;
`;
const RowOperatorContainer = styled.div`
    display: block;
`;

const OpContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`;
export interface FormInputDataType {
  [key: string]: string | number;
}

export interface UpdateMapProps {
  addType: number
  enumDefault: number
  field: string
  value: string
  parentName: string
  fieldValueId: string
  nodeId: string
  mode: number
}

export interface ConditionProps {
  field?: string
  fieldType?: string
  nodeName?: string
  fieldName?: string
  operator: string
  value: string
  concat: number  //拼接符：1-并且，2-或者
  errorIgnore: number //条件异常时忽略
  nullIgnore: number  //值为空时忽略
}

export interface ConditionGroupProps {
  group: ConditionProps[]
}

export const ConditionFieldGroup = memo((props: {
  onRef?: Ref<any>;
  formId: string;
  initVariables?: boolean;
  groupList?: ConditionGroupProps[];
}) => {

  const {onRef, groupList} = props;
  const [formFieldData, setFormFieldData] = useState<FormInputDataType[]>([]);
  const [fieldList, setFieldList] = useState<any[]>([]);


  const [root, setRoot] = useState<ConditionGroupProps[]>(
    groupList?groupList:[]
  );
/*  const getFormFieldList = (formId: string) => {
    if(formId){
      getSheetFields(formId).then((res) => {

        if (res.code === '00000') {
          setFormFieldData(res.data || []);
          setFieldList(getSheetFieldDataList(res.data || []));
        } else {
          message.error(res.msg);
        }
      });
    }
  };*/
  const getFormFieldList = (formId: string) => {
    // 模拟字段数据
    const mockFields: FormInputDataType[] = [
      { id: 'name', name: '姓名', famsType: 'input-text', type: 'text' },
      { id: 'age', name: '年龄', famsType: 'input-number', type: 'number' },
    ];

    setFormFieldData(mockFields);

    const list = mockFields?.map((item: FormInputDataType) => ({ label: item.fcomment, value: item.id })) || [{ label: "暂无数据", value: "" }];

    setFieldList(list);
  };

  const getField = (condition: ConditionProps) => {

    const fieldId = condition.field;
    const field = formFieldData.find(field => field.id === fieldId);
    return field ? field : {}
  }
  const convertToConditionPropsArray = (conditionGroups: ConditionGroupProps[]): ConditionProps[][] => {
    return conditionGroups.map(group => group.group);  // 提取每个 group 数组，形成二维数组
  };

  // 暴露给父组件的方法
  useImperativeHandle(onRef, () => ({
    getConditionGroup: () => {
      return convertToConditionPropsArray(root);
    }
  }));

  // 页面加载时获取字段列表
  useEffect(() => {
    getFormFieldList(props.formId);
  }, [props.formId]);

  useEffect(() => {
    setRoot(props.groupList?props.groupList:[]);
  }, [props.groupList]);

  const handleChange = (gIndex: number, cIndex: number, field: string, value: any) => {
    setRoot(prevRoot => {
      const newRoot = [...prevRoot];
      const condition = newRoot[gIndex]?.group?.[cIndex];
      if (!condition) return prevRoot; // 防止越界

      switch (field) {
        case "field":
          condition.field = value || "";
          condition.value = "";
          break;
        case "operator":
          condition.operator = value;
          break;
        case "value":
          condition.value = value?.target ? value.target.value || "" : value || "";
          break;
        case "nullIgnore":
          condition.nullIgnore = value;
          break;
        case "fieldGroup":
          condition.field = value || "";
          condition.fieldType = value?.fieldType || "";
          condition.nodeName = value?.nodeName || "";
          condition.fieldName = value?.fieldName || "";
          break;
        default:
          break;
      }
      console.log(newRoot)
      return newRoot;
    });
  };


  const addGroup = () => {
    setRoot([...root, { group: [{ field: "", operator: "equals",  value: "",concat: 2  } as ConditionProps] }]);
  };

  const addField = (gIndex: number) => {
    const newRoot = [...root];
    newRoot[gIndex].group.push({ field: "", operator: "equals",  value: "",concat: 1 } as ConditionProps);
    setRoot(newRoot);
  };

  const deleteField = (gIndex: number, index: number) => {
    const newRoot = [...root];
    newRoot[gIndex].group.splice(index, 1);

    if (newRoot[gIndex].group.length === 0) {
      newRoot.splice(gIndex, 1);
    }

    setRoot(newRoot);
  };

  return (
    <Space direction="vertical" size={0}>
      {root.map((group, gIndex) => (
        <Space key={gIndex} direction="vertical" size={0}>
          {
            gIndex > 0 &&
            <Divider style={{marginTop: 0,marginBottom: 24}}>或</Divider>
          }
          {group.group.map((condition, index) => (
            <div key={"key"+index}>
              {
                index > 0 &&
                <OpContainer>且</OpContainer>
              }

              <RowContainer>
                <ProFormSelect
                    label={""}
                    fieldProps={{
                      value: condition.field,
                    }}
                    colProps={{md: 12, xl: 24}}
                    placeholder="请选择字段"
                    /*rules={[
                      {
                        required: true,
                        message: "请选择字段",
                      },
                    ]}*/
                    formItemProps={{style: {marginBottom: '0px'}}}
                    options={fieldList}
                    onChange={(e) => {
                      handleChange(gIndex,index, "field", e);
                    }}
                />

                <RowOperatorContainer>
                  <a onClick={() => {
                    deleteField(gIndex, index)
                  }}><DeleteOutlined style={{color: 'red'}}/></a>
                </RowOperatorContainer>
              </RowContainer>

              <RowContainer>
                {
                  condition.field && <>
                    <ProFormSelect
                      label={""}
                      fieldProps={{
                        value: condition.operator,
                      }}
                      colProps={{md: 12, xl: 24}}
                      initialValue={'equals'}
                      formItemProps={{style: {marginBottom: '0px'}}}
                      valueEnum={{
                        'equals': '等于',
                        'notEquals': '不等于',
                        'small': '小于',
                        'smallEquals': '小于等于',
                        'great': '大于',
                        'greatEquals': '大于等于',
                        'in': '包含',
                        /*'not in': '不包含',
                          'is_empty': '为空',
                         'is_not_empty': '不为空',*/
                      }}
                      onChange={(e) => {
                        handleChange(gIndex,index, "operator", e);
                      }}
                    />

                    {
                      condition.operator && (condition.operator === "equals" || condition.operator === "notEquals"
                        || condition.operator === "small"  || condition.operator === "smallEquals"
                        || condition.operator === "great" || condition.operator === "greatEquals"
                        || condition.operator === "in" || condition.operator === "select_not_any_in"
                      ) &&
                      <ProFormCheckbox.Group
                        layout="vertical"
                        label=""
                        fieldProps={{
                          value: [condition?.nullIgnore?.toString()],
                          onChange: (value) => {
                            console.log('选中的值:', value);
                            // 在这里处理你需要的逻辑
                            handleChange(gIndex,index, "nullIgnore", value);
                          }
                        }}
                        formItemProps={{style: {marginBottom: '0px'}}}
                        options={[{label: '值为空时忽略', value: "1"}]}
                      />
                    }
                  </>
                }
                {
                  !condition.field &&
                  <UpdateDisabledTipContainer/>
                }
              </RowContainer>

              <RowContainer>
                {
                  condition.field && <>
                    <DataInput showLabel={false} index={index}
                               field={getField(condition)}
                               inputValue={{
                                 mode: 0,
                                 field: condition.field,
                                 value: condition.value
                               } as UpdateMapProps}
                               onChange={(e) => {
                                 handleChange(gIndex,index, "value", e);
                               }}
                    ></DataInput>
                  </>
                }
                {
                  !condition.field &&
                  <UpdateDisabledTipContainer/>
                }
              </RowContainer>

              {
                index === group.group.length -1 &&
                <Space style={{marginBottom: 24}}>
                  <Button onClick={() => {
                    addField(gIndex);
                  }}><PlusOutlined/>且</Button>
                  <Button onClick={addGroup}><PlusOutlined/>或</Button>
                </Space>
              }
            </div>
          ))}
        </Space>
      ))}
      {
        (!root || root.length === 0) &&
        <RowContainer>
          <Button onClick={addGroup}><PlusOutlined />筛选条件</Button>
        </RowContainer>
      }
    </Space>
  );
});
