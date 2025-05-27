import React, {memo} from 'react';
import {Space} from "antd";
import {ProFormDigit, ProFormText} from '@ant-design/pro-components';

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

export const getFieldLength = (field:any) => {
  
  return 20;
};
export function getFieldType(field:FormInputDataType){

  if(field.famsType === "select"){
    return "select";
  }else if(field.famsType === "input-number"){
    return "number";
  }else if(field.famsType === "input-date"){
    return "date";
  }

  return "text";
}

export const DataInput = memo((props: {
  index: number;
  showLabel?: boolean;
  field: FormInputDataType;
  onChange: (e: any) => void;
  inputValue?: UpdateMapProps;
}) => {

  const { showLabel = true} = props;

  const convertToNumber = (inputValue:any) => {
    // 判断是否是数值
    if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
      const numericValue = parseFloat(inputValue); // 转换为数值

      // 判断是否是整数
      if (Number.isInteger(numericValue)) {
        return parseInt(inputValue, 10); // 转换为整数
      } else {
        return numericValue; // 保留小数
      }
    } else {
      return null;
    }
  };


  const style = {minWidth: 200};
  const field = props.field;

  let inputValue =  null;
  let combValue = false;
  let inputLabel = field.flabel? field.flabel : (field.name?field.name:"");
  if(props.inputValue && props.inputValue.value){
    inputValue =  props.inputValue.value;
  }
  return (
    <>
      <Space.Compact style={style} key={props.index}>
        {!combValue && getFieldType(field) === 'text' && (
            <ProFormText
                label={showLabel ? inputLabel : ""}
                placeholder={"请输入" + inputLabel}
                formItemProps={{style: {marginBottom: '0px'}}}
                fieldProps={{
                  value: inputValue || "",
                  maxLength:getFieldLength(field),
                  onChange: (e) => {
                    //console.log(e.target.value);
                    //debugger
                    props.onChange(e.target.value);
                  }
                }}

            />
        )}

        {!combValue && getFieldType(field) === 'number' && (
            <ProFormDigit
                label={showLabel ? inputLabel : ""}
                placeholder={"请输入" + inputLabel}
                fieldProps={{
                  value: convertToNumber(inputValue),
                  precision: 2,
                  onChange: (e) => {
                    //console.log(e);
                    //debugger
                    props.onChange(e);
                  }
                }}
            />
        )}

        
      </Space.Compact>
    </>
  );
});
