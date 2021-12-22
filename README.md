<div align="center">
  <h1>
    <br/>
    <br />
    🔗 bind-url-hash
    <br />
    <br />
  </h1>
</div>

## *use url hash store state and provide responsive react hook*

```
http://example.com/#message=hello
                   --------------
```
mapping to object
```javascript
{
  message: 'hello'
}
```
bind to Component state
```javascript
function MyComp() {
  const [state] = useURLHash()
  return (
    <div>message: {state.message}</div>
  )
}
```

bindding is **responsive** !

when you change url hash, the component will update with it.


## DEMO
[CodeSandbox](https://codesandbox.io/s/bind-url-hash-demo-63bnb)
