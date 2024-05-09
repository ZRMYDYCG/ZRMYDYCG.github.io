toRef 可以用来为源响应式对象的某个 property 新创建一个 ref，然后 ref 可以被传递，它会保持对其源 property 的响应式连接。

```vue
<script setup>
import { reactive, toRef } from 'vue'

const state = reactive({
  foo: 1,
  bar: 2,
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
</script>
```

这里我们为 state 对象的 foo 属性创建一个名为 fooRef的 ref，当我们 fooRef.value++ 时，此时 state.foo 的值也跟着变，因为 toRef 会保持对其源对象属性的响应连接，所以，当 state.foo 值变化时，fooRef 的值也会跟着变。

这些点，相信大家都知道。

但  toRef 也可以提供一个默认值，这个点可能大家就比较少见了。

我们来看个例子，假设我们想为 state 对象的 car 属性创建一个名为 carRef 的 ref，但 state 对象的 car 属性可能不存在，当 car 不存在时，我们需要给个默认值，这个时候就可以用到 toRef 的第三个参数了，就是为属性提供默认值:

```vue
toRef(object, property, default)
```

代码如下：

```vue
<script setup>
import { reactive, toRef } from 'vue'

const state = reactive({
  foo: 1,
  bar: 2,
})

const carRef = toRef(state, 'car', 10)
console.log(carRef.value) // 10
</script>
```