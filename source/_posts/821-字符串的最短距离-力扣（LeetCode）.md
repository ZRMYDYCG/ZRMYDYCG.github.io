---
title: 821.字符串的最短距离-力扣（LeetCode）
date: 2024-02-07 17:59:44
tags:
  - LeetCode 解题报告
categories:
  - LeetCode
cover: https://pic.imgdb.cn/item/65c355a99f345e8d0307dcc8.png
---

## 题目详情

`简单`

给你一个字符串 s 和一个字符 c ，且 c 是 s 中出现过的字符。返回一个整数数组 answer ，其中 answer.length == s.length 且 answer[i] 是 s 中从下标 i 到离它 最近 的字符 c 的 距离 。两个下标 i 和 j 之间的 距离 为 abs(i - j) ，其中 abs 是绝对值函数。
## 示例

- 示例 1：

输入：

```bash
s = "loveleetcode", c = "e"
```

输出：

```bash
[3,2,1,0,1,0,0,1,2,2,1,0]
```

解释：

字符 'e' 出现在下标 3、5、6 和 11 处（下标从 0 开始计数）。

距下标 0 最近的 'e' 出现在下标 3 ，所以距离为 abs(0 - 3) = 3 。

距下标 1 最近的 'e' 出现在下标 3 ，所以距离为 abs(1 - 3) = 2 。

对于下标 4 ，出现在下标 3 和下标 5 处的 'e' 都离它最近，但距离是一样的 abs(4 - 3) == abs(4 - 5) = 1 。

距下标 8 最近的 'e' 出现在下标 6 ，所以距离为 abs(8 - 6) = 2 。

- 示例 2：

输入：

```bash
s = "aaab", c = "b"
```

输出：

```bash
[3,2,1,0]
```

## 提示
- 1 <= s.length <= 104
- s[i] 和 c 均为小写英文字母
- 题目数据保证 c 在 s 中至少出现一次
## 题解

```javascript
/**
  @ 一小池勺 
 * @param {string} s
 * @param {character} c
 * @return {number[]}
  @ 2024 1 30
 */
var shortestToChar = function(S, C) {
  const resultArray = new Array(S.length).fill(0)
  let NowTargetCharC_Index = 0

  // 一次遍历
  const charArray = Array.from(S) // 将字符串转换为数组
  charArray.forEach((item, index) => {
    if(item === C) {
      resultArray[index] = 0
      NowTargetCharC_Index = index
    } else {
      // 针对当前的 i 元素 => 进行前后距离比较
      resultArray[index] = Math.min(Math.abs(S.indexOf(C, index) - index), Math.abs(S.indexOf(C, NowTargetCharC_Index) - index))
    }
  })

  return resultArray
}
```

## 代码思路

- 创建一个与字符串长度相同的数组resultArray，并将其填充为0。

- 初始化变量NowTargetCharC_Index为0，用于记录当前目标字符C的索引位置。

- 将字符串转换为字符数组charArray。

- 使用forEach方法遍历charArray中的每个字符。

- 如果当前字符等于目标字符C，将resultArray相应索引位置的值设置为0，并更新NowTargetCharC_Index为当前索引。

- 如果当前字符不等于目标字符C，通过indexOf方法分别计算当前索引位置到目标字符C的前一个索引位置和后一个索引位置的距离，并将较小的距离赋值给resultArray相应索引位置。

- 返回resultArray作为结果。
