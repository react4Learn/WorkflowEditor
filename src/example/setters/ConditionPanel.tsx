import {memo, Ref, useEffect, useImperativeHandle, useRef, useState} from "react"
import {Form} from "antd"
import {IWorkFlowNode, useEditorEngine, useSelectedNode, useStartNode} from "../../workflow-editor";
import {ProForm} from "@ant-design/pro-components";
import styled from 'styled-components';
import {ConditionFieldGroup} from "../../workflow-editor/components/ConditionGroup";
export interface IConditionSettings {
    filters?: any;
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



const FormContainer = styled.div`
    display: block;
    width: 100%;
    padding: 0 4px 8px 4px;
    font-size: 16px;
    font-weight: bold;
`;

const FormTipsContainer = styled.div`
    display: block;
    background: #f5f5f5;
    border-radius: 3px;
    line-height: 22px;
    margin-bottom: 15px;
    padding: 10px 14px;
    width: 100%;
`;


export const ConditionPanel = memo((
  props: {
    onRef?: Ref<any>;
    value?: IConditionSettings
    onChange?: (value?: IConditionSettings) => void
  }
) => {
    const {onRef} = props;
    const [form] = Form.useForm();
    const store = useEditorEngine()
    const selectedNode = useSelectedNode()
    const startNode = useStartNode()
    const conditionRef = useRef<any>();
    const [groupList, setGroupList] = useState<ConditionGroupProps[]>(
        []
    );
    const convertToConditionGroupProps = (conditionPropsArray: ConditionProps[][]): ConditionGroupProps[] => {
        return conditionPropsArray.map(group => ({ group }));  // 将每个子数组转换为一个 ConditionGroupProps 对象
    };
    
    useEffect(() => {
        console.log(selectedNode);
        if (selectedNode && startNode) {
            const node = (selectedNode as IWorkFlowNode<IConditionSettings>);
            if (node.config?.filters) {
                const groupRoot = convertToConditionGroupProps(node.config?.filters)
                setGroupList(groupRoot)
            }
        }
    }, [selectedNode, startNode]);


    const doFormSubmit = (callback: (result: boolean, value?: any) => void) => {

        form.validateFields().then(function (res) {
            console.log(res);
            //console.log(selectedNode);
            let copySelectNode: any = store?.getNode(selectedNode?.id||"") ;
            if(!copySelectNode){
                copySelectNode = {...selectedNode}
            }

            const conditionList = conditionRef.current?.getConditionGroup() || [];
            const startNode = store?.store.getState().startNode;

            const newNode = {
                ...copySelectNode,
                //name:store?.store.getState().selectedName,
                config:{
                    // 其他属性
                    filters:conditionList,
                }
            }

            store?.changeNode(newNode);

            callback(true, newNode);

        }).catch(function (err) {
            console.log(err)
            callback(false, null);
        });
    };

    // 暴露给父组件的方法
    useImperativeHandle(onRef, () => ({
        doFormSubmit: (callback: (result: boolean, value?: any) => void) => doFormSubmit(callback),
    }));
  return (
      <ProForm
          layout="vertical"
          colon={false}
          form={form}
          grid={true}
          submitter={false}
      >
          <FormContainer>
              筛选条件
          </FormContainer>
          <>
              <FormTipsContainer>
                  设置筛选条件后，满足条件的数据才能进入该分支
              </FormTipsContainer>
              <ConditionFieldGroup onRef={conditionRef} formId={""} initVariables={true} groupList={groupList}/>
          </>
      </ProForm>
  )
})
