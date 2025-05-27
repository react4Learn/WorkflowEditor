import { Button, Space } from "antd"
import { memo } from "react"
import { styled } from "styled-components"
import { useTranslate } from "../../react-locales"

const Shell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
`

export const Footer = memo((props: {
  loading:boolean,
  onConfirm: () => void,
  onCancel: () => void
}) => {
  const { onConfirm, onCancel } = props
  const t = useTranslate()
  return (
    <Shell className="settings-footer">
      <Space>
        <Button onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="primary"  loading={props.loading} onClick={onConfirm}>
          {t("confirm")}
        </Button>
      </Space>
    </Shell>
  )
})
