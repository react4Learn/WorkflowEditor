import { CloseOutlined } from "@ant-design/icons"
import { Button, Drawer } from "antd"
import { memo, useCallback } from "react"
import { NodeTitle } from "./NodeTitle"
import { Footer } from "./Footer"
import { useSelectedNode } from "../../hooks/useSelectedNode"
import { useEditorEngine } from "../../hooks"
import { styled } from "styled-components"
import { useMaterialUI } from "../../hooks/useMaterialUI"

const Content = styled.div`
  display: flex;
  flex-flow: column;
`
export const SettingsPanel = memo(() => {
  const selectedNode = useSelectedNode()
  const materialUi = useMaterialUI(selectedNode)
  const store = useEditorEngine()
  const handelClose = useCallback(() => {
    store?.selectNode(undefined)
  }, [store])

  const handleConfirm = useCallback(() => {
    store?.selectNode(undefined)
  }, [store])

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
          onConfirm={handleConfirm}
          onCancel={handelClose}
        />
      }
      onClose={handelClose}
      open={!!selectedNode}
    >
      <Content className="settings-panel-content">
        {materialUi?.settersPanel && <materialUi.settersPanel value={""} onChange={handleSettingsChange} />}
      </Content>
    </Drawer>
  )
})