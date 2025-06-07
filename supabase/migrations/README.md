# 数据库迁移文件

这个目录包含所有的数据库迁移文件，按照时间顺序编号。

## 迁移文件命名规范

```
XXX_description.sql
```

- `XXX`: 三位数字编号，从 001 开始
- `description`: 简短的英文描述

## 当前迁移列表

| 编号 | 文件名 | 描述 | 日期 |
|------|--------|------|------|
| 001 | `001_add_hidden_field.sql` | 为 thoughts 表添加 hidden 字段 | 2024-12-19 |

## 如何应用迁移

### 新安装

对于全新的数据库安装：

1. 首先运行基础 schema：
   ```sql
   -- 在 Supabase SQL Editor 中运行
   \i supabase/schema.sql
   ```

2. 然后按顺序运行所有迁移：
   ```sql
   -- 按编号顺序运行每个迁移文件
   \i supabase/migrations/001_add_hidden_field.sql
   ```

### 现有数据库升级

对于已经存在的数据库，只需要运行尚未应用的迁移：

1. 检查当前数据库版本
2. 运行所需的迁移文件

## 迁移最佳实践

1. **永远不要修改已应用的迁移文件**
2. **新的更改总是创建新的迁移文件**
3. **迁移应该是幂等的（可以安全重复运行）**
4. **迁移应该包含回滚指令（在注释中）**
5. **测试迁移在开发环境中的效果**

## 回滚指令

如果需要回滚某个迁移，参考各迁移文件中的回滚注释。

### 回滚 001_add_hidden_field.sql

```sql
-- 回滚迁移 001
DROP INDEX IF EXISTS idx_thoughts_user_hidden;
ALTER TABLE public.thoughts DROP COLUMN IF EXISTS hidden;
``` 