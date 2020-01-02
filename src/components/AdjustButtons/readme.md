## 自动收起按钮组件 AdjustButtons
> 一排按钮太多溢出显示区域时，自动收起溢出的button

### 用法

```typescript jsx

const editButton = <Button>编辑</Button>;
const deleteButton = <Button>删除</Button>;
const copyButton = <Button>复制</Button>;
const transferButton = <Button>转移</Button>;

<AdjustButtons>
  <AdjustButtons.WrapButton>
    <Button>编辑</Button>
  </AdjustButtons.WrapButton>
  <AdjustButtons.WrapButton>
    <Button>删除</Button>
  </AdjustButtons.WrapButton>
  <AdjustButtons.WrapButton>
    <Button>复制</Button>
  </AdjustButtons.WrapButton>
  <AdjustButtons.WrapButton>
    <Button>转移</Button>
  </AdjustButtons.WrapButton>
</AdjustButtons>

```
