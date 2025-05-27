import { styled } from "styled-components"
import { Button, Select } from "antd"
import { useTranslate } from "../../react-locales";
import { memo, useCallback } from "react";
import { ExpressionGroupType, ExpressionNodeType, IExpression, IExpressionGroup, IExpressionNode } from "../../interfaces";
import { ExpressionInputProps } from "./ExpressionInputProps";
import { ExpressionItem, Item, itemHeight } from "./ExpressionItem";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { AddMenu } from "./AddMenu";
import { createUuid } from "../../utils/create-uuid";

const ExpressionGroupShell = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 88px;
`
const GroupOperator = styled.div`
  position: relative;
  width: 80px;
  //border: solid 1px;
  display: flex;
  align-items: center;
  padding-right: 16px;
`

const GroupOperatorLine = styled.div`
  position: absolute;
  left: calc(50% - 8px);
  width: 30px;
  border: solid 1px ${props => props.theme.token?.colorBorder};
  border-right: 0;
  border-radius: 5px 0 0 5px;
  height: calc(100% - ${itemHeight}px);
  &::before{
    content: "";
    position: absolute;
    top:0;
    right:0;
    transform: translateX(100%) translateY(-50%);
    width: 6px;
    height: 6px;
    border: solid 1px ${props => props.theme.token?.colorBorder};
    border-radius: 50%;
  }
  &::after{
    content: "";
    position: absolute;
    bottom:0;
    right:0;
    transform: translateX(100%) translateY(50%);
    width: 6px;
    height: 6px;
    border: solid 1px ${props => props.theme.token?.colorBorder};
    border-radius: 50%;
  }
`

const ExpressionChildren = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
`

const GroupAction = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

// const SuccessIcon = styled(CheckCircleFilled)`
//   color:${props => props.theme.token?.colorSuccess};
// `
// const ErrorIcon = styled(CloseCircleFilled)`
//   color:${props => props.theme.token?.colorError};
// `

export const ExpressionGroup = memo((
  props: {
    ExpressInput: React.FC<ExpressionInputProps>
    value: IExpressionGroup,
    onChange?: (value: IExpressionGroup) => void,
    onRemove?: (nodeId: string) => void
    root?: boolean,
  }
) => {
  const { ExpressInput, value, onChange, onRemove, root } = props
  const t = useTranslate()

  const handleAddExp = useCallback(() => {
    value && onChange?.({
      ...value,
      children: [
        ...value.children,
        {
          id: createUuid(),
          nodeType: ExpressionNodeType.Expression
        }
      ]
    })
  }, [onChange, value])

  const handleAddGroup = useCallback((groupType: ExpressionGroupType) => {
    const newNode: IExpressionGroup = {
      id: createUuid(),
      nodeType: ExpressionNodeType.Group,
      groupType: groupType,
      children: [
        {
          id: createUuid(),
          nodeType: ExpressionNodeType.Expression
        }
      ]
    }
    onChange?.({
      ...value,
      children: [
        ...value.children,
        newNode,
      ]
    })
  }, [onChange, value])

  const handleAddExpAfter = useCallback((index: number) => {
    const newNode: IExpression = {
      id: createUuid(),
      nodeType: ExpressionNodeType.Expression
    }
    const newChildren = [...value.children]
    newChildren.splice(index + 1, 0, newNode)
    onChange?.({
      ...value,
      children: newChildren
    })
  }, [onChange, value])

  const handleAddGroupAfter = useCallback((index: number, groupType: ExpressionGroupType) => {
    const newNode: IExpressionGroup = {
      id: createUuid(),
      nodeType: ExpressionNodeType.Group,
      groupType,
      children: [
        {
          id: createUuid(),
          nodeType: ExpressionNodeType.Expression
        }
      ]
    }
    const newChildren = [...value.children]
    newChildren.splice(index + 1, 0, newNode)
    onChange?.({
      ...value,
      children: newChildren
    })
  }, [onChange, value])

  const handleChildChange = useCallback((node: IExpressionNode) => {
    onChange?.({
      ...value,
      children: value.children?.map(child => child.id === node.id ? node : child)
    })
  }, [onChange, value])

  const handelGroupTypeChange = useCallback((groupType: ExpressionGroupType) => {
    onChange?.({
      ...value,
      groupType,
    })
  }, [onChange, value])

  const handleRemoveChild = useCallback((nodeId: string) => {
    onChange?.({
      ...value,
      children: (value.children as IExpressionNode[]).filter((child) => child.id !== nodeId)
    })
  }, [onChange, value])

  const handleDeleteClick = useCallback(() => {
    onRemove?.(value.id)
  }, [onRemove, value.id])

  return (
    <ExpressionGroupShell className="expression-group">
      <GroupOperator className="group-operator">
        <GroupOperatorLine className="group-operator-line" />
        <Select
          defaultValue={ExpressionGroupType.And}
          value={value?.groupType}
          options={[
            { value: ExpressionGroupType.And, label: t(ExpressionGroupType.And) },
            { value: ExpressionGroupType.Or, label: t(ExpressionGroupType.Or) },
          ]}
          onChange={handelGroupTypeChange}
        />
      </GroupOperator>
      <ExpressionChildren className="expression-children">
        {
          value?.children?.map((child, index) => {
            return (
              child.nodeType === ExpressionNodeType.Group ?
                <ExpressionGroup
                  key={child.id}
                  ExpressInput={ExpressInput}
                  value={child as IExpressionGroup}
                  onChange={handleChildChange}
                  onRemove={() => handleRemoveChild(child.id)}
                />
                : <ExpressionItem
                  key={child.id}
                  onAddExpression={() => handleAddExpAfter(index)}
                  onAddGroup={(nodType) => handleAddGroupAfter(index, nodType)}
                  onRemove={() => handleRemoveChild(child.id)}
                >
                  <ExpressInput />
                </ExpressionItem>
            )
          })
        }
        {
          !value?.children.length && <Item></Item>
        }
        <Item>
          <GroupAction>
            <AddMenu
              onAddExpression={handleAddExp}
              onAddGroup={handleAddGroup}
            >
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
              >
                {t("add")}
              </Button>
            </AddMenu>
            {
              !root && <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ marginLeft: 8 }}
                onClick={handleDeleteClick}
              />
            }
          </GroupAction>
        </Item>
      </ExpressionChildren>
    </ExpressionGroupShell>
  )
})