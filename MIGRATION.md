# Migration Guide

From `v1.x.x` to `v2.x.x`.

## Contents

- [Import / Require](#import--require)
- [Routes](#routes)
- [Fetch](#fetch--routerhandle)


## Import / Require

### Before

```javascript
const Router = require('@tsndr/cloudflare-worker-router')
```


### After

```javascript
import Router from '@tsndr/cloudflare-worker-router'
```


## Routes

Just add curly braces.


### Before

<a href="https://gist.github.com/tsndr/34e8544266ae15d51abd019d7c3d27ca" target="_blank"><img width="469" alt="Petrify 2022-06-24 at 5 57 01 PM" src="https://user-images.githubusercontent.com/2940127/175572731-a8729c1b-15e2-45ac-be80-7e8527c5502a.png"></a>


### After

<a href="https://gist.github.com/tsndr/8db6e8dd55e348015c2ff8e93dd6aa31" target="_blank"><img width="469" alt="Petrify 2022-06-24 at 5 55 56 PM" src="https://user-images.githubusercontent.com/2940127/175572549-0eea8fc4-3d90-412a-89cc-d2f4569f1139.png"></a>


## Fetch / `router.handle()`

❗️ Be aware that with `v2.0.0` the parameters of `router.handle()` changed ❗️


### Before

<a href="https://gist.github.com/tsndr/12b0f800269760c597646c90a562ef88" target="_blank"><img width="469" alt="Petrify 2022-06-24 at 5 58 43 PM" src="https://user-images.githubusercontent.com/2940127/175572993-fb4681c2-eece-4c92-88e8-1c2f57644769.png"></a>


### After

<a href="https://gist.github.com/tsndr/30902b01b134e2a58cf3a53648dd3e47" target="_blank"><img width="393" alt="Petrify 2022-06-24 at 5 59 22 PM" src="https://user-images.githubusercontent.com/2940127/175573110-b7dfcfb2-855d-4529-a957-6f8b9ec439f3.png"></a>
