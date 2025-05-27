import { CloseOutlined } from "@ant-design/icons"
import {Button, Drawer, message} from "antd"
import {memo, useCallback, useRef, useState} from "react"
import { NodeTitle } from "./NodeTitle"
import { Footer } from "./Footer"
import { useSelectedNode } from "../../hooks/useSelectedNode"
import {useEditorEngine, useStartNode} from "../../hooks"
import { styled } from "styled-components"
import { useMaterialUI } from "../../hooks/useMaterialUI"
import {IWorkFlowNode} from "../../interfaces";
import {createUuid} from "../../utils/create-uuid";

const Content = styled.div`
  display: flex;
  flex-flow: column;
`

function saveFlowNodes(param: any): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("=============这里保存数据=============")
      console.log(param)
      // 模拟成功返回
      resolve({
        code: '00000',
        data: 'fake-id-12345' // 模拟返回的 ID
      });
    }, 1000); 
  });
}
export const SettingsPanel = memo(() => {
  const selectedNode = useSelectedNode()
  const startNode = useStartNode()
  const materialUi = useMaterialUI(selectedNode)
  const store = useEditorEngine()
  const panelRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(false);
  
  const handelClose = useCallback(() => {
    store?.selectNode(undefined)
  }, [store])

  const handleConfirm = useCallback(() => {
    if (panelRef.current) {
      panelRef.current.doFormSubmit(function (resultForm: boolean, newNode?: any) {
        if (resultForm) {
          //console.log(startNode);
          let node = store?.getNode(startNode?.id||"") ;

          if(node){
            if(node.id==='start'){
              node.id = createUuid();
            }
            //验证通过
            const param: IWorkFlowNode = {
              //...workFlowBase,
              childNode: {
                ...node
              }
            } as IWorkFlowNode;
            setLoading(true);
            //保存整个startNode
            saveFlowNodes(param).then(function (res:any) {
              setLoading(false);
              if (res.code === '00000') {
                let id = res.data;
                store?.selectNode(undefined)
                //其他数据处理
                //history.replace(`/flow/startflow?id=` + id);
              } else {
                message.error(res.msg);
              }
            }).catch(function (err:any) {
              message.error(err);
            });
          }
        }
      });
    }

  }, [store?.store,selectedNode,startNode])

  const handleNameChange = useCallback((name?: string) => {

  }, [])

  const handleSettingsChange = useCallback((value: any) => {

  }, [])
  return (
    <Drawer
      title={selectedNode &&
        <NodeTitle
          node={selectedNode}
          onNameChange={handleNameChange}
        />
      }
      placement="right"
      width={656}
      closable={false}
      extra={
        <Button
          size="small"
          type="text"
          icon={<CloseOutlined />}
          onClick={handelClose}
        />
      }
      footer={
        <Footer
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={handelClose}
        />
      }
      onClose={handelClose}
      open={!!selectedNode}
    >
      <Content className="settings-panel-content">
        {materialUi?.settersPanel && <materialUi.settersPanel onRef={panelRef} value={""} onChange={handleSettingsChange} />}
      </Content>
    </Drawer>
  )
})
