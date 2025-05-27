import { memo, useState } from "react"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { FormAuth } from "./FormAuth"
import { Form } from "antd"
import { ButtonSelect, MemberSelect } from "../../workflow-editor"
import { useTranslate } from "../../workflow-editor/react-locales"

export interface IStartSettings {

}

export const StartPanel = memo((
  props: {
    value?: IStartSettings
    onChange?: (value?: IStartSettings) => void
  }
) => {
  const [settingsType, setSettingsType] = useState<string>("node")
  const t = useTranslate()

  return (
    <Form layout="vertical" colon={false}>
      <ButtonSelect
        options={[
          {
            key: "node",
            label: t("setPromoter"),
          },
          {
            key: "formAuth",
            label: <>{t("formAuth")} <QuestionCircleOutlined /></>
          }
        ]}
        value={settingsType}
        onChange={setSettingsType}
      />
      {settingsType === "node" && <>
        <Form.Item label={t("whoCanSubmit")} style={{ marginTop: 16 }}>
          <MemberSelect />
        </Form.Item>
      </>}
      {settingsType === 'formAuth' && <FormAuth />}
    </Form>
  )
})